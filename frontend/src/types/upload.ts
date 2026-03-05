
export interface UploadableFile {
    file: File;
    localId: string;
    previewUrl: string;
    progress: number;
    status: 'IDLE' | 'UPLOADING' | 'SUCCESS' | 'FAILED';
    targetWidth?: string;

    data?: {
        id: string;
        url: string;
    };
}