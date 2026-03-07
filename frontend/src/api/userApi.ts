import type { AxiosInstance } from "axios";
import type PublicProfile from "../types/PublicProfile";


async function getPublicProfile(api: AxiosInstance, username: string): Promise<PublicProfile>{
    let response;
    try{
        response = await api.get(`/profile/${username}`);
    }catch(errors: any){
        throw errors;
    }
    return response?.data;
}

async function getPublicProfileById  (api: AxiosInstance, userId: string): Promise<PublicProfile>{
    let response;
    try{
        response = await api.get<PublicProfile>(`/profile/users/${userId}`);
    }catch(errors: any){
        throw errors;
    }
    return response?.data;
  }

async function sendFriendRequest(api: AxiosInstance, username: string) {
    let response;
    try{
        response = await api.post(`/friends/request/${username}`);
    }catch(errors: any){
        throw errors;
    }
    return response?.data;
}

async function isFriend(api: AxiosInstance, friendId: string) {
    let response;
    try{
        response = await api.get(`/friends/${friendId}`);
    }catch(errors: any){
        throw errors;
    }
    return response?.data;
}


export {
    getPublicProfile,
    getPublicProfileById,
    sendFriendRequest,
    isFriend
}