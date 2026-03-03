export interface Notification {
    id: string;
    userId: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
    targetUrl?: string;
}
