import useApiPrivate from "../hooks/useApiPrivate";

const MAZAD_IP = import.meta.env.VITE_MAZAD_IP;

export const useNotificationApi = () => {
    const apiPrivate = useApiPrivate(); 
    // @ Naoufal remove 'https://localhost' when front dev end, leave /api.

    const BASE_URL = `https://${MAZAD_IP}/api/v1`;

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