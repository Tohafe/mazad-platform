import type { UploadableFile } from '../../types/upload';
import { FiFile } from 'react-icons/fi';
import React from 'react';

interface FilePreviewProps {
    fileData: UploadableFile;
    onRemove: (idToDrop: string) => void;
    isMain?: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileData, onRemove, isMain = false }) => {
    const isImage = fileData.file.type.startsWith('image/');

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div

            className="relative border rounded-lg p-3 flex flex-col items-center shadow-sm bg-white select-none h-full min-w-0"
            onMouseDown={(e) => e.preventDefault()}
        >
            {isMain && (
                <div
                    className="absolute -top-2 -left-2 text-xl z-10 bg-white rounded-full shadow-sm leading-none"
                    title="Main Thumbnail"
                >
                    ⭐
                </div>
            )}

            <button
                onClick={() => onRemove(fileData.localId)}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none z-10 shadow-sm"
                title="Remove file"
            >
                &times;
            </button>

         <div className="w-full h-28 relative bg-gray-100 rounded mb-2 overflow-hidden shrink-0 flex justify-center items-center">
                
                {isImage ? (
                    <img
                        src={fileData.previewUrl}
                        alt={fileData.file.name}
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        draggable={false}
                    />
                ) : (
                    <FiFile className="w-12 h-12 text-gray-400" />
                )}

                {fileData.status === 'UPLOADING' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 z-20">
                        <span className="text-white font-bold text-sm mb-2 drop-shadow-md">
                            {fileData.progress || 0}%
                        </span>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out" 
                                style={{ width: `${fileData.progress || 0}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {fileData.status === 'SUCCESS' && (
                    <div className="absolute inset-0 border-5 border-green-500 rounded z-30 pointer-events-none"></div>
                )}
                </div>

                <div className="w-full text-center select-none min-w-0 mt-auto">
                    <p
                        className="text-sm font-medium text-gray-700 truncate w-full block"
                        title={fileData.file.name}
                    >
                        {fileData.file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {formatSize(fileData.file.size)}
                    </p>
                </div>

                {fileData.status === 'FAILED' && (
                    <div className="absolute inset-2  bg-red-900/75 flex flex-col items-center justify-center p-3 z-20 text-center animate-fadeIn">
                        <span
                            className="text-red-900 mb-1 drop-shadow-md text-2xl leading-none"
                            aria-hidden="true"
                        >
                            ⚠️
                        </span>
                        <span className="text-red-600 font-bold text-sm mb-1 drop-shadow-md">Upload Failed</span>

                        <span className="text-gray-400 text-xs font-medium line-clamp-2 px-2">
                            {fileData.errorMessage || "Network connection failed."}
                        </span>
                    </div>
                    )}

        </div>
    );
};

export default FilePreview;