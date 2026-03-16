import useApiPrivate from "../hooks/useApiPrivate";

export const useNotificationApi = () => {
    const apiPrivate = useApiPrivate(); 
    // @ Naoufal remove 'https://localhost' when front dev end, leave /api.
    const BASE_URL = 'https://localhost/api';

    return {
        getPage: async (pageNumber: number) => {
            // Notifications are at /api/notifications, not /api/v1/notifications 
            const response = await apiPrivate.get(`/notifications?pageNumber=${pageNumber}`, { baseURL: BASE_URL });
            return response.data;
        },
        
        markAsRead: async (id: string) => {
            await apiPrivate.put(`/notifications/${id}/read`, {}, { baseURL: BASE_URL });
        },

        markAllAsRead: async () => {
            const response = await apiPrivate.put(`/notifications/read-all`, {}, { baseURL: BASE_URL });
            return response.data;
        }
    };
};