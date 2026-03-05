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

    // ------------------------------------------------------------------
    // 1. THE CORE FUNCTION (For your friend's single images)
    // ------------------------------------------------------------------
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

    // ------------------------------------------------------------------
    // 2. THE BATCH ORCHESTRATOR (For your Auction Gallery)
    // ------------------------------------------------------------------
    const uploadMultipleFiles = async (
        filesToUpload: UploadableFile[], 
        onProgressUpdate: (localId: string, progress: number) => void
    ) => {
        setIsUploading(true);

        try {
            // Map over the array and call the Single File function for each one
            const uploadPromises = filesToUpload.map(async (fileObj) => {
                try {
                    // It reads the width directly from your struct!
                    const data = await uploadSingleFile(
                        fileObj.file, 
                        fileObj.targetWidth || '0', 
                        (progress) => onProgressUpdate(fileObj.localId, progress)
                    );
                    
                    return { localId: fileObj.localId, data, success: true };
                } catch (error) {
                    // If one fails, we catch it here so the others keep going
                    return { localId: fileObj.localId, data: null, success: false };
                }
            });

            // Wait for all parallel threads to finish
            const results = await Promise.allSettled(uploadPromises);

            const successfulUploads: { localId: string; data: FileResponse }[] = [];
            const failedUploads: string[] = [];

            // Sort the results
            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    if (result.value.success && result.value.data) {
                        successfulUploads.push({ localId: result.value.localId, data: result.value.data });
                    } else {
                        failedUploads.push(result.value.localId);
                    }
                }
            });

            return { successfulUploads, failedUploads };

        } catch (error) {
            console.error("Critical error in batch upload:", error);
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