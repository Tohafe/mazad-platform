import { useState } from 'react';
import useApiPrivate from './useApiPrivate';
import type { UploadableFile } from '../types/upload';

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


    const uploadSingleFile = async (
        file: File, 
        targetWidth: string = '0', 
        onProgress?: (progress: number) => void
    ): Promise<FileResponse> => {
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('width', targetWidth);

        const response = await apiPrivate.post<FileResponse>('/api/media', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onProgress) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percent); 
                }
            }
        });

        return response.data;
    };


    const uploadMultipleFiles = async (
        filesToUpload: UploadableFile[], 
        onProgressUpdate: (localId: string, progress: number) => void
    ) => {
        setIsUploading(true);

        try {
           
            const uploadPromises = filesToUpload.map(async (fileObj) => {
                try {
                    const data = await uploadSingleFile(
                        fileObj.file, 
                        fileObj.targetWidth || '0', 
                        (progress) => onProgressUpdate(fileObj.localId, progress)
                    );
                    return { localId: fileObj.localId, data, success: true };
                } catch (error: any) {
                    // THE EXTRACTION: Dig into the Axios error to find what Spring Boot said!
                    const backendMessage = 
                        error.response?.data?.message || 
                        error.response?.data?.error || 
                        "The server rejected this file.";
                        
                    return { localId: fileObj.localId, data: null, success: false, errorMessage: backendMessage };
                }
            });

            const results = await Promise.allSettled(uploadPromises);

            const successfulUploads: { localId: string; data: FileResponse }[] = [];
            
            // We change this from an array of strings to an array of objects so it can hold the message!
            const failedUploads: { localId: string; errorMessage: string }[] = [];

            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    if (result.value.success && result.value.data) {
                        successfulUploads.push({ localId: result.value.localId, data: result.value.data });
                    } else {
                        // Pass the extracted message into the failed list!
                        failedUploads.push({ 
                            localId: result.value.localId, 
                            errorMessage: result.value.errorMessage || "Unknown error" 
                        });
                    }
                }
            });

            return { successfulUploads, failedUploads };

        } catch (error) {
            console.error("error in  upload:", error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        isUploading,
        uploadSingleFile,
        uploadMultipleFiles
    };
};