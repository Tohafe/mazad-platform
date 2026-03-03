

export interface UploadableFile {

    file: File;               
    localId: string;          
    previewUrl: string;       
    progress: number;         
    status: 'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR';


    serverId?: string;        
    url?: string;             
    thumbnailUrl?: string;    

}