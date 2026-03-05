import AuctionDetailsStep from '../components/Form/AuctionDetails';
import ImageUploadStep from '../components/Form/ImageUpload';
import { useFileUpload } from '../hooks/useFileUpload';
import type { UploadableFile } from '../types/upload';
import { useNavigate } from 'react-router-dom';
import { apiPrivate } from '../api/axios';
import  { useState } from 'react';

//remove step from the name 

// The exact match for your Java ItemDetailsDto
export interface ItemDetailsResponse {
    id: number;
    categoryId: number;
    sellerId: string;
    title: string;
    description: string;
    status: string;
    images: string[];
    specs: Record<string, string>;
    shippingInfo: string;
    startingPrice: number;
    currentBid: number;
    startsAt: string;
    endsAt: string;
    createdAt: string;
    updatedAt: string;
}

const CreateAuction = () => {
    const REQUIRED_IMAGE_COUNT = 4;

    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [files, setFiles] = useState<UploadableFile[]>([]);
    const [errorToast, setErrorToast] = useState<string | null>(null);

    // Network Hook (Waiting patiently for Step 2)
    const { uploadMultipleFiles, isUploading } = useFileUpload();

    // --- 2. THE GLOBAL SUPERVISOR (Error Handler) ---
    const showError = (message: string) => {
        setErrorToast(message); 
        setTimeout(() => setErrorToast(null), 3000);
    };

    // --- 3. MEMORY MANAGEMENT (For Step 1) ---
    const handleFilesSelected = (newFiles: File[]) => {
        const spaceLeft = REQUIRED_IMAGE_COUNT - files.length;
        if (newFiles.length > spaceLeft) {
            showError(`You can only upload a maximum of ${REQUIRED_IMAGE_COUNT} images.`);
        }

        setFiles(prevFiles => {
            const currentSpace = REQUIRED_IMAGE_COUNT - prevFiles.length;
            if (currentSpace <= 0) return prevFiles; 

            const filesToAdd = newFiles.slice(0, currentSpace);
            const mappedFiles: UploadableFile[] = filesToAdd.map(file => ({
                file,
                localId: Math.random().toString(36).substring(7), 
                previewUrl: URL.createObjectURL(file), 
                progress: 0,
                status: 'IDLE'
            }));

            return [...prevFiles, ...mappedFiles];
        });
    };

    const handleRemoveFile = (idToDrop: string) => {
        setFiles(prevFiles => {
            const fileToDelete = prevFiles.find(f => f.localId === idToDrop);
            if (fileToDelete) URL.revokeObjectURL(fileToDelete.previewUrl);
            return prevFiles.filter(f => f.localId !== idToDrop);
        });
    };

    const handleProgressUpdate = (localId: string, progress: number) => {
        setFiles(prevFiles => prevFiles.map(fileObj => 
            fileObj.localId === localId 
                ? { ...fileObj, progress, status: progress === 100 ? 'SUCCESS' : 'UPLOADING' } 
                : fileObj
        ));
    };

    // --- 4. THE PIPELINE EXECUTION ---
    // Notice: It now accepts the text payload from Step 2!
    const handleFinalSubmit = async (auctionTextData: any) => {
        if (files.length !== REQUIRED_IMAGE_COUNT) return;
        setErrorToast(null);

        const navigate = useNavigate();
        // --- PHASE A: THE SMART RETRY FILTER ---
        // Only grab files that haven't succeeded yet. 
        const pendingFiles = files.filter(f => f.status !== 'SUCCESS');

        if (pendingFiles.length > 0) {
            console.log(`Uploading ${pendingFiles.length} pending files to MinIO...`);
            
            // Just-In-Time Width Injection (Preserves the index 0 rule)
            const filesPreparedForUpload = pendingFiles.map((fileObj) => {
                const isMainImage = files.findIndex(f => f.localId === fileObj.localId) === 0;
                return { ...fileObj, targetWidth: isMainImage ? '800' : '0' };
            });

            // Execute Upload to Media Service
            const { successfulUploads, failedUploads } = await uploadMultipleFiles(
                filesPreparedForUpload, 
                handleProgressUpdate
            );

            // Handle Failures (The Retry Trigger)
            if (failedUploads.length > 0) {
                setFiles(prev => prev.map(f => 
                    failedUploads.includes(f.localId) ? { ...f, status: 'FAILED' as any, progress: 0 } : f
                ));
                showError(`${failedUploads.length} images failed. Please check your connection and click Retry.`);
                return; // HALT PIPELINE! Wait for the user to click the orange Retry button.
            }

            // Save the newly acquired UUIDs into our React state memory
            setFiles(prev => prev.map(f => {
                const match = successfulUploads.find(s => s.localId === f.localId);
                return match ? { ...f, status: 'SUCCESS', data: match.data } : f;
            }));
        }

        // --- PHASE B: THE FINAL DTO STITCHER ---
        // If we reach this line, ALL 4 images are guaranteed to be SUCCESS.
        console.log("All images secured! Stitching final DTO payload...");

        try {
            // Grab the UUIDs safely from the current state and the recent upload batch
            const finalImageIds = files.map(f => {
                if (f.data?.id) return f.data.id;
                // If it was just uploaded in this exact cycle, find it in the pending batch
                const recent = pendingFiles.find(p => p.localId === f.localId);
                return recent ? recent.data?.id : null; 
            }).filter(Boolean); // removes any accidental nulls

            // Convert local HTML time to strictly formatted UTC Instant for Java
            const utcEndDate = new Date(auctionTextData.endDate).toISOString();

            // Assemble the exact structure of your ItemRequestDto
            const finalPayload = {
                categoryId: auctionTextData.categoryId,
                title: auctionTextData.title,
                description: auctionTextData.description,
                specs: auctionTextData.specs,
                shippingInfo: auctionTextData.shippingInfo, 
                startingPrice: auctionTextData.startingPrice,
                endsAt: utcEndDate,       
                thumbnail: finalImageIds[0],      
                images: finalImageIds             
            };

            console.log("Transmitting payload to items-service:", finalPayload);
            
            // EXECUTE THE FINAL POST REQUEST
            // Note: If your API Gateway handles the X-User-Id, this is all you need!
            const response = await apiPrivate.post<ItemDetailsResponse>('/api/v1/items/', finalPayload);
            
            // If you MUST send the X-User-Id manually from React because you lack a Gateway, 
            // you would do it like this instead:
            // const response = await apiPrivate.post<ItemDetailsResponse>('/api/v1/items/', finalPayload, {
            //     headers: { 'X-User-Id': 'the-uuid-string' }
            // });

            console.log("Auction Created Successfully!", response.data);
            
            // The backend responds with the ItemDetailsDto! We grab the newly minted ID.
            const newAuctionId = response.data.id;

            // Instantly route the user to their live auction page
            navigate(`/items/${newAuctionId}`);

        } catch (error) {
            console.error("Failed to create auction item:", error);
            showError("Images uploaded safely, but creating the auction failed. Please click Retry.");
        }
    };

    

    // --- 5. RENDER THE CONTROLLER ---
    return (
        <div className="max-w-6xl mx-auto p-6 mt-8">
            
            {/* Visual Stepper Navigation */}
            <div className="mb-8 flex items-center justify-center space-x-4 select-none">
                <div className={`px-4 py-2 rounded-full font-bold transition-colors ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-blue-300 text-white'}`}>
                    1. Images
                </div>
                <div className="h-1 w-16 bg-gray-300 rounded-sm overflow-hidden">
                    <div className={`h-full bg-blue-600 transition-all duration-500 ${currentStep === 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold transition-colors ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2. Details
                </div>
            </div>

            <div className="bg-white rounded border border-gray-200 shadow-none p-8">
                

                {currentStep === 1 && (
                    <ImageUploadStep 
                        files={files}
                        onFilesSelected={handleFilesSelected}
                        onRemoveFile={handleRemoveFile}
                        requiredCount={REQUIRED_IMAGE_COUNT}
                        onNextStep={() => setCurrentStep(2)} 
                    />
                )}

                {/* STATE 2: TEXT LINKER VIEW (Placeholder) */}
                {currentStep === 2 && (
                    <AuctionDetailsStep 
                        onBack={() => setCurrentStep(1)} 
                        onSubmit={handleFinalSubmit}     
                        isSubmitting={isUploading}       
                        onError={showError}
                        hasFailedUploads={files.some(f => f.status === 'FAILED')} 
                    />
                )}
            </div>

            {/* GLOBAL ERROR LISTENER */}
            {errorToast && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center">
                    <span className="font-medium">{errorToast}</span>
                </div>
            )}
        </div>
    );
};

export default CreateAuction;