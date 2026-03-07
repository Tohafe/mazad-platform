import AuctionDetails from '../components/Form/AuctionDetails';
import ImageUpload from '../components/Form/ImageUpload';
import { useFileUpload } from '../hooks/useFileUpload';
import type { UploadableFile } from '../types/upload';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import  { useState } from 'react';

//remove step from the name 

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
    const navigate = useNavigate();
    
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);

    const { createItem, isCreating } = useItems();

    let latestSuccessfulUploads: { localId: string; data: any }[] = [];

    const [files, setFiles] = useState<UploadableFile[]>([]);
    const [errorToast, setErrorToast] = useState<string | null>(null);

    const { uploadMultipleFiles, isUploading } = useFileUpload();

    const showError = (message: string) => {
        setErrorToast(message); 
        setTimeout(() => setErrorToast(null), 3000);
    };

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


    const handleFinalSubmit = async (auctionTextData: any) => {
        if (files.length !== REQUIRED_IMAGE_COUNT) return;
        setErrorToast(null);

        const pendingFiles = files.filter(f => f.status !== 'SUCCESS');

        if (pendingFiles.length > 0) {
            console.log(`Uploading ${pendingFiles.length} pending files to MinIO...`);
            
            const filesPreparedForUpload = pendingFiles.map((fileObj) => {
                const isMainImage = files.findIndex(f => f.localId === fileObj.localId) === 0;
                return { ...fileObj, targetWidth: isMainImage ? '800' : '0' };
            });


            const { successfulUploads, failedUploads } = await uploadMultipleFiles(
                filesPreparedForUpload, 
                (localId, progress) => handleProgressUpdate(localId, progress)
            );

            
            if (failedUploads.length > 0) {
                setFiles(prev => prev.map(f => 
                    failedUploads.includes(f.localId) ? { ...f, status: 'FAILED' as any, progress: 0 } : f
                ));
                showError(`${failedUploads.length} images failed. Please check your connection and click Retry.`);
                return; 
            }

            latestSuccessfulUploads = successfulUploads;

            setFiles(prev => prev.map(f => {
                const match = successfulUploads.find(s => s.localId === f.localId);
                return match ? { ...f, status: 'SUCCESS', data: match.data } : f;
            }));
        }

        console.log("All images secured! Stitching final DTO payload...");

        try {
            const finalImageUrls = files.map(f => {
                const justUploaded = latestSuccessfulUploads.find(s => s.localId === f.localId);
                if (justUploaded?.data?.url) return justUploaded.data.url;
                
                return f.data?.url || null; 
            }).filter(Boolean) as string[]; 

            const firstFileId = files[0].localId;
            const newlyUploadedFirst = latestSuccessfulUploads.find(s => s.localId === firstFileId);
            const thumbnailString = newlyUploadedFirst?.data?.thumbnailUrl || files[0].data?.thumbnailUrl || "";
            
            const utcEndDate = new Date(auctionTextData.endDate).toISOString();
            
            const finalPayload = {
                categoryId: auctionTextData.categoryId,
                title: auctionTextData.title,
                description: auctionTextData.description,
                specs: auctionTextData.specs,
                shippingInfo: auctionTextData.shippingInfo, 
                startingPrice: auctionTextData.startingPrice,
                endsAt: utcEndDate,       
                thumbnail: thumbnailString,       
                images: finalImageUrls            
            };

            console.log("Transmitting payload to items-service:", finalPayload);
            
            const newAuctionItem = await createItem(finalPayload);
            
            console.log("Auction Created Successfully!", newAuctionItem);
            navigate(`/items/${newAuctionItem.id}`);

        } catch (error) {
            console.error("Failed to create auction item:", error);
            showError("Images uploaded safely, but creating the auction failed. Please click Retry.");
        }
    };

    

    return (
        <div className="max-w-6xl mx-auto p-6 mt-8">
            
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
                    <ImageUpload 
                        files={files}
                        onFilesSelected={handleFilesSelected}
                        onRemoveFile={handleRemoveFile}
                        requiredCount={REQUIRED_IMAGE_COUNT}
                        onNextStep={() => setCurrentStep(2)} 
                    />
                )}

                {currentStep === 2 && (
                    <AuctionDetails 
                        onBack={() => setCurrentStep(1)} 
                        onSubmit={handleFinalSubmit}     
                        isSubmitting={isUploading || isCreating}       
                        onError={showError}
                        hasFailedUploads={files.some(f => f.status === 'FAILED')} 
                    />
                )}
            </div>

            {errorToast && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center">
                    <span className="font-medium">{errorToast}</span>
                </div>
            )}
        </div>
    );
};

export default CreateAuction;