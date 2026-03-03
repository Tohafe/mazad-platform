import { useState } from 'react';
import useApiPrivate from './useApiPrivate';
import type { UploadableFile } from '../types/upload';

const IP = import.meta.env.VITE_MAZAD_IP;

export interface FileResponse {
    id: string;
    url: string;
    thumbnailUrl: string;
    name: string;
    type: string;
    size: number;
}

export const useFileUpload = () => {
    const apiPrivate = useApiPrivate(); 
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const uploadMultipleFiles = async (
        filesToUpload: UploadableFile[], 
        onProgressUpdate: (localId: string, progress: number) => void
    ) => {
        setIsUploading(true);

        try {

            const uploadPromises = filesToUpload.map(async (fileObj) => {

                const formData = new FormData();
                formData.append('file', fileObj.file);


                const response = await apiPrivate.post<FileResponse>(
                    `${IP}/api/media`, 
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                      
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.total) {

                                const percentCompleted = Math.round(
                                    (progressEvent.loaded * 100) / progressEvent.total
                                );
                                
                                onProgressUpdate(fileObj.localId, percentCompleted);
                            }
                        }
                    }
                );

                return {
                    localId: fileObj.localId,
                    data: response.data 
                };
            });

       
            const results = await Promise.allSettled(uploadPromises);


            const successfulUploads: { localId: string; data: FileResponse }[] = [];
            const failedUploads: string[] = [];

            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    successfulUploads.push(result.value);
                } else {
                    console.warn("A file failed to upload:", result.reason);
                }
            });

            return { successfulUploads, failedUploads };

        } catch (error) {
            console.error("Critical error in upload manager:", error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        isUploading,
        uploadMultipleFiles
    };
};