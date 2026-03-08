import type { AuctionFormData } from '../components/Form/AuctionDetails';
import AuctionDetails from '../components/Form/AuctionDetails';
import ImageUpload from '../components/Form/ImageUpload';
import FilePreview from '../components/Form/FilePreview';
import { useFileUpload } from '../hooks/useFileUpload';
import type { UploadableFile } from '../types/upload';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../hooks/useItems';
import  { useState } from 'react';



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

    
    const [formData, setFormData] = useState<AuctionFormData>({
        categoryId: 0, 
        title: '',
        description: '',
        startingPrice: 0,
        endDate: '',
        shippingInfo: ''
    });

    const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>([
        { key: '', value: '' } 
    ]);

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

        const pendingFiles = files.filter((f, index) => {
            if (f.status !== 'SUCCESS') return true;
            if (index === 0 && !f.data?.thumbnailUrl) return true;
            return false; 
        });

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


            setFiles(prev => prev.map(f => {
                // Find if this file is in the newly updated failed list
                const failedMatch = failedUploads.find(fail => fail.localId === f.localId);
                
                if (failedMatch) {
                    return { 
                        ...f, 
                        status: 'FAILED' as any, 
                        progress: 0, 
                        errorMessage: failedMatch.errorMessage // <-- Save the Spring Boot message!
                    };
                }
                const successMatch = successfulUploads.find(s => s.localId === f.localId);
                if (successMatch) {
                    return { ...f, status: 'SUCCESS', data: successMatch.data };
                }
                return f;
            }));

            
            if (failedUploads.length > 0) {
                showError(`${failedUploads.length} images failed. Please check the error messages and click Retry.`);
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
            navigate(`/itemDetails/${newAuctionItem.id}`);

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
                        formData={formData}
                        setFormData={setFormData}
                        specsList={specsList}
                        setSpecsList={setSpecsList}
                    />
                )}
            </div>

            {errorToast && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center">
                    <span className="font-medium">{errorToast}</span>
                </div>
            )}

        {isUploading && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full">
                        
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Securing Your Auction</h3>
                            <p className="text-gray-500 mt-2">Uploading high-resolution media to the server...</p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {files.map((fileObj, index) => (
                                <div key={fileObj.localId}>
                                    <FilePreview 
                                        fileData={fileObj} 
                                        onRemove={() => {}} 
                                        isMain={index === 0}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-center items-center gap-3 text-blue-600">
                            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="font-semibold text-lg">Uploading ...</span>
                        </div>
                        
                    </div>
                </div>
            )}

        </div>
    );
};

export default CreateAuction;