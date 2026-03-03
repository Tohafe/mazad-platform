import useApiPrivate from "../hooks/useApiPrivate";

const IP = import.meta.env.VITE_GATEWAY_URL;

export const useNotificationApi = () => {
    const apiPrivate = useApiPrivate(); 

    return {
        getPage: async (pageNumber: number) => {
            const response = await apiPrivate.get(`${IP}/api/notifications?pageNumber=${pageNumber}`, {
            });
            return response.data;
        },
        
        markAsRead: async (id: string) => {
            await apiPrivate.put(`${IP}/api/notifications/${id}/read`, {}, {
            });
        },

        markAllAsRead: async () => {
            const response = await apiPrivate.put(`${IP}/api/notifications/read-all`, {}, {
            });
            return response.data;
        }
    };
};