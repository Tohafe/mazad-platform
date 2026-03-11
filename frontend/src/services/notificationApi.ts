import useApiPrivate from "../hooks/useApiPrivate";

export const useNotificationApi = () => {
    const apiPrivate = useApiPrivate(); 

    return {
        getPage: async (pageNumber: number) => {
            // Notifications are at /api/notifications, not /api/v1/notifications
            const response = await apiPrivate.get(`/notifications?pageNumber=${pageNumber}`, { baseURL: '/api' });
            return response.data;
        },
        
        markAsRead: async (id: string) => {
            await apiPrivate.put(`/notifications/${id}/read`, {}, { baseURL: '/api' });
        },

        markAllAsRead: async () => {
            const response = await apiPrivate.put(`/notifications/read-all`, {}, { baseURL: '/api' });
            return response.data;
        }
    };
};