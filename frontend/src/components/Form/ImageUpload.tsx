import React from 'react';
import Dropzone from './DropZone';
import FilePreview from './FilePreview';
import type { UploadableFile } from '../../types/upload';

interface ImageUploadProps {
    files: UploadableFile[];
    onFilesSelected: (newFiles: File[]) => void;
    onRemoveFile: (idToDrop: string) => void;
    onSetMainFile: (idToMakeMain: string) => void;
    onNextStep: () => void; 
    requiredCount: number;
    additionalMedia: UploadableFile | null;
    onAdditionalMediaSelected: (newFiles: File[]) => void;
    onRemoveAdditionalMedia: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    files,
    onFilesSelected,
    onRemoveFile,
    onSetMainFile,
    onNextStep,
    requiredCount,
    additionalMedia,
    onAdditionalMediaSelected,
    onRemoveAdditionalMedia
}) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Step 1: Item Images</h2>
                <p className="text-gray-600 mb-6">
                    Upload exactly {requiredCount} high-quality images of your item.
                </p>

                <Dropzone
                    multiple={true}
                    maxSizeMB={15}
                    onFilesSelected={onFilesSelected}
                />
            </div>

            {files.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Selected Files ({files.length} / {requiredCount})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 min-w-0">
                        {files.map((fileObj, index) => (
                            <FilePreview
                                key={fileObj.localId}
                                fileData={fileObj}
                                onSetMain={() => onSetMainFile(fileObj.localId)}
                                onRemove={onRemoveFile}
                                isMain={index === 0}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Supporting Document (Optional)</h2>
                <p className="text-gray-600 mb-6">
                    Upload a certificate of authenticity, a receipt, or a short video of the item.
                </p>

                {!additionalMedia ? (
                    <Dropzone
                        multiple={false} 
                        maxSizeMB={50} 
                        acceptedTypes="application/pdf, video/mp4, video/webm, video/quicktime, text/plain "
                        onFilesSelected={onAdditionalMediaSelected}
                    />
                ) : (
                    <div className="w-64"> 
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Attached File:</h3>
                        <FilePreview 
                            fileData={additionalMedia} 
                            onRemove={onRemoveAdditionalMedia}
                            onSetMain={() => {}} 
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-6  mt-8">
                <button
                    type="button"
                    onClick={onNextStep} 
                    disabled={files.length !== requiredCount}
                    className={`px-8 py-3 rounded-lg font-medium text-white transition-all
                        ${files.length !== requiredCount 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    Next Step: Auction Details &rarr;
                </button>
            </div>
        </div>
    );
};

export default ImageUpload;