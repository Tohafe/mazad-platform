import React, { useRef, useState } from 'react';

interface DropzoneProps {
    onFilesSelected: (files: File[]) => void;
    maxSizeMB?: number;
    acceptedTypes?: string;
    multiple?: boolean;
    children?: React.ReactNode;
}

const Dropzone: React.FC<DropzoneProps> = ({ 
    onFilesSelected, 
    maxSizeMB = 5,
    acceptedTypes = 'image/*',
    multiple = false,
    children
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    
 
    const dragCounter = useRef(0);

    const handleBoxClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

  
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current += 1; 
        
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current -= 1; 
        

        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); 
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0; 

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };


    const processFiles = (fileList: FileList) => {
        const filesArray = Array.from(fileList);
        const maxSizeBytes = maxSizeMB * 1024 * 1024; 

        let validFiles = filesArray.filter(file => {
            const isUnderMaxSize = file.size <= maxSizeBytes;
            const isAcceptedType = acceptedTypes === 'image/*' 
                ? file.type.startsWith('image/')
                : acceptedTypes.includes(file.type);

            if (!isUnderMaxSize) console.warn(`${file.name} is too large.`);
            if (!isAcceptedType) console.warn(`${file.name} is not an accepted type.`);

            return isUnderMaxSize && isAcceptedType;
        });

        if (!multiple && validFiles.length > 0) {
            validFiles = [validFiles[0]];
        }

        if (validFiles.length > 0) {
            onFilesSelected(validFiles);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            processFiles(event.target.files);
            event.target.value = ''; 
        }
    };

    return (
        <div 
            onClick={handleBoxClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            /* Use inline-block so it shrinks */
            className={children ? "inline-block cursor-pointer" : "block cursor-pointer"}
        >
            {children ? (
                children
            ) : (
                <div className={`border-2 border-dashed p-10 text-center transition-colors rounded-lg
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-400 hover:bg-gray-50'}`}
                >
                    <p className={`text-lg font-medium ${isDragging ? 'text-blue-600' : 'text-gray-600'}`}>
                        {isDragging ? 'Drop files now!' : 'Click or drag files here'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Accepted: {acceptedTypes} (Max {maxSizeMB}MB)
                    </p>
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple={multiple}
                accept={acceptedTypes}
                onChange={handleFileChange} 
            />
        </div>
    );
};

export default Dropzone;