import axios from "axios";

const IP = import.meta.env.VITE_MAZAD_IP;

export const notificationApi = {
    getPage: async (pageNumber: number) => {

        await new Promise<void>((resolve) => {
            window.setTimeout(() => resolve(), 2000); 
        })

        const response = await axios.get(`${IP}/api/notifications?pageNumber=${pageNumber}`, {
            headers: { "X-User-Id": "01" }
        });
        return response.data;
    },
    
    markAsRead: async (id: string) => {
        await axios.put(`${IP}/api/notifications/${id}/read`, {}, {
            headers: { "X-User-Id": "01" }
        });
    },


    markAllAsRead: async () => {
        const response = await axios.put(`${IP}/api/notifications/read-all`, {}, {
            headers: { "X-User-Id": "01" }
        });
        return response.data;
    }
};