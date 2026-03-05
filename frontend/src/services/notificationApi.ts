import useApiPrivate from "../hooks/useApiPrivate";


export const useNotificationApi = () => {
    const apiPrivate = useApiPrivate(); 

    return {
        getPage: async (pageNumber: number) => {
            const response = await apiPrivate.get(`/api/notifications?pageNumber=${pageNumber}`, {
            });
            return response.data;
        },
        
        markAsRead: async (id: string) => {
            await apiPrivate.put(`/api/notifications/${id}/read`, {}, {
            });
        },

        markAllAsRead: async () => {
            const response = await apiPrivate.put('/api/notifications/read-all', {}, {
            });
            return response.data;
        }
    };
};