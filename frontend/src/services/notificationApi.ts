import axios from "axios";

export const notificationApi = {
    getPage: async (pageNumber: number) => {

        await new Promise<void>((resolve) => {
            window.setTimeout(() => resolve(), 2000); 
        })

        const response = await axios.get(`http://localhost:8082/api/notifications?pageNumber=${pageNumber}`, {
            headers: { "X-User-Id": "01" }
        });
        return response.data;
    },
    
    markAsRead: async (id: string) => {
        await axios.put(`http://localhost:8082/api/notifications/${id}/read`, {}, {
            headers: { "X-User-Id": "01" }
        });
    },


    markAllAsRead: async () => {
        const response = await axios.put(`http://localhost:8082/api/notifications/read-all`, {}, {
            headers: { "X-User-Id": "01" }
        });
        return response.data;
    }
};