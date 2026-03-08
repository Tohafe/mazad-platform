import React from 'react';
import Dropzone from './DropZone';
import FilePreview from './FilePreview';
import type { UploadableFile } from '../../types/upload';

interface ImageUploadProps {
    files: UploadableFile[];
    onFilesSelected: (newFiles: File[]) => void;
    onRemoveFile: (idToDrop: string) => void;
    onNextStep: () => void; 
    requiredCount: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    files,
    onFilesSelected,
    onRemoveFile,
    onNextStep,
    requiredCount
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
                    acceptedTypes={'image/png image/jpeg  video/mp4'}
                    maxSizeMB={200}
                    onFilesSelected={onFilesSelected}
                />
            </div>

            {files.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Selected Files ({files.length} / {requiredCount})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {files.map((fileObj, index) => (
                            <FilePreview
                                key={fileObj.localId}
                                fileData={fileObj}
                                onRemove={onRemoveFile}
                                isMain={index === 0}
                            />
                        ))}
                    </div>
                </div>
            )}

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