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
        targetheight: string = '300', 
        onProgress?: (progress: number) => void
    ): Promise<FileResponse> => {
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('width', targetWidth);
        formData.append('height', targetheight);

        const response = await apiPrivate.post<FileResponse>('/media', formData, {
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
                        fileObj.targetheight || '300', 
                        (progress) => onProgressUpdate(fileObj.localId, progress)
                    );
                    return { localId: fileObj.localId, data, success: true };
                } catch (error: any) {
                    const backendMessage = 
                        error.response?.data?.message || 
                        error.response?.data?.error || 
                        "The server rejected this file.";
                        
                    return { localId: fileObj.localId, data: null, success: false, errorMessage: backendMessage };
                }
            });

            const results = await Promise.allSettled(uploadPromises);

            const successfulUploads: { localId: string; data: FileResponse }[] = [];
            
            const failedUploads: { localId: string; errorMessage: string }[] = [];

            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    if (result.value.success && result.value.data) {
                        successfulUploads.push({ localId: result.value.localId, data: result.value.data });
                    } else {
                        failedUploads.push({ 
                            localId: result.value.localId, 
                            errorMessage: result.value.errorMessage || "Unknown error" 
                        });
                    }
                }
            });

            return { successfulUploads, failedUploads };

        } catch (error) {
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const deleteFile = async (fileId: string): Promise<boolean> => {
        try {
            await apiPrivate.delete(`/media/${fileId}`);
            return true; 
        } catch (error) {
            return false; 
        }
    };

    const updateFile = async (
        fileId: string, 
        newFile: File, 
        targetWidth: string = '0', 
        targetheight: string = '300',
        onProgress?: (progress: number) => void
    ): Promise<FileResponse> => {
        
        const formData = new FormData();
        formData.append('file', newFile);
        formData.append('width', targetWidth);
        formData.append('height', targetheight);

        const response = await apiPrivate.put<FileResponse>(`/media/${fileId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onProgress) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percent); 
                }
            }
        });

        const timestamp = new Date().getTime(); 
        
        if (response.data.url) {
            response.data.url = `${response.data.url}?t=${timestamp}`;
        }
        if (response.data.thumbnailUrl) {
            response.data.thumbnailUrl = `${response.data.thumbnailUrl}?t=${timestamp}`;
        }
        return response.data;
    };


    const saveFile = async (
        file: File, 
        fileId?: string | null,
        targetWidth: string = '0', 
        targetheight: string = '300', 
        onProgress?: (progress: number) => void
    ): Promise<FileResponse> => {
        
        if (fileId) {
            return await updateFile(fileId, file, targetWidth, targetheight, onProgress);
        } else {
            return await uploadSingleFile(file, targetWidth, targetheight, onProgress);
        }
    };

    return {
        isUploading,
        uploadSingleFile,
        uploadMultipleFiles,
        deleteFile,
        saveFile,
        updateFile
    };
};