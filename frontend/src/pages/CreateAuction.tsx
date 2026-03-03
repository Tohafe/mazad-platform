import FilePreview from "../components/Form/FilePreview"; 
import { useFileUpload } from "../hooks/useFileUpload";
import type { UploadableFile } from "../types/upload";
import Dropzone from '../components/Form/DropZone';
import  { useState } from 'react';


const CreateAuction = () => {

    const [files, setFiles] = useState<UploadableFile[]>([]);
    const { uploadMultipleFiles,
            isUploading
            } = useFileUpload();

    
    const handleFilesSelected = (newFiles: File[]) => {
        const mappedFiles: UploadableFile[] = newFiles.map(file => ({
            file,
            localId: Math.random().toString(36).substring(7), 
            previewUrl: URL.createObjectURL(file), 
            progress: 0,
            status: 'IDLE'
        }));

        setFiles(prevFiles => [...prevFiles, ...mappedFiles]);
    };

   
    const handleRemoveFile = (idToDrop: string) => {
        setFiles(prevFiles => {

            const fileToDelete = prevFiles.find(f => f.localId === idToDrop);
            
            
            if (fileToDelete) {
                URL.revokeObjectURL(fileToDelete.previewUrl);
            }

            
            return prevFiles.filter(f => f.localId !== idToDrop);
        });
    };



    
    const handleProgressUpdate = (localId: string, progress: number) => {
        setFiles(prevFiles => 
            prevFiles.map(fileObj => 
                fileObj.localId === localId 
                    ? { 
                        ...fileObj, 
                        progress: progress, 
                        status: progress === 100 ? 'SUCCESS' : 'UPLOADING' 
                      } 
                    : fileObj
            )
        );
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        

        if (files.length === 0) return;

        console.log("Starting upload pipeline...");
        

        const { successfulUploads, failedUploads } = await uploadMultipleFiles(files, handleProgressUpdate);

        console.log("Uploads finished!");
        console.log("Success:", successfulUploads); 
        console.log("Failed:", failedUploads);
    };




    return (
        <div className="max-w-4xl mx-auto p-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Create New Auction
                </h1>
                
       
                <form onSubmit={handleSubmit}>
                    <p className="text-gray-600 mb-8">
                        Upload your item images and provide the details below.
                    </p>

                    <Dropzone
                        multiple={true}
                        maxSizeMB={15}
                        acceptedTypes="image/png,image/jpg,application/pdf"
                        onFilesSelected={handleFilesSelected}
                    />

                    {files.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Selected Files ({files.length})
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {files.map(fileObj => (
                                    <FilePreview 
                                        key={fileObj.localId} 
                                        fileData={fileObj} 
                                        onRemove={handleRemoveFile} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={isUploading || files.length === 0}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors
                                ${isUploading || files.length === 0 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isUploading ? 'Uploading...' : 'Confirm Upload'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};;

export default CreateAuction;