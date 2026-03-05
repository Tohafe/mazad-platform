import React from 'react';
import type { UploadableFile } from '../../types/upload';

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
            // 1. min-w-0 stops the grid blowout. h-full keeps all cards equal height. (No overflow-hidden here!)
            className="relative border rounded-lg p-3 flex flex-col items-center shadow-sm bg-white select-none h-full min-w-0"
            onMouseDown={(e) => e.preventDefault()}
        >
            {isMain && (
                <div
                    className="absolute -top-3 -left-3 text-xl z-10 bg-white rounded-full shadow-sm leading-none"
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

            {/* 2. The Image Container: Strict height, relative anchor, and overflow hidden ONLY here */}
            <div className="w-full h-28 relative bg-gray-100 rounded mb-2 overflow-hidden shrink-0 flex justify-center items-center">
                {isImage ? (
                    // 3. Absolute inset-0 divorces the image's real size from the grid layout
                    <img
                        src={fileData.previewUrl}
                        alt={fileData.file.name}
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        draggable={false}
                    />
                ) : (
                    <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
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
        </div>
    );
};

export default FilePreview;