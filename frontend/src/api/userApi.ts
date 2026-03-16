import type { AxiosInstance } from "axios";
import type PublicProfile from "../types/PublicProfile";
import type AvatarData from "../types/AvatarData";
import type { ProfileData } from "../components/Form/Profile";


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

async function editAvatar(api: AxiosInstance, avatarData: AvatarData) {
    let response;
    try{
        response = await api.post('/profile/avatar', avatarData);
    }catch(errors: any){
        throw errors;
    }
    return response?.data;
}

// async function getPrivateProfile(api: AxiosInstance) {
//     let response;
//     try{
//         response = await api.get('/profile');
//     }catch(errors: any){
//         throw errors;
//     }
//     return response?.data;
// }

async function getPrivateProfile(api: AxiosInstance, manualToken?: string) {
    const config = manualToken 
        ? { headers: { Authorization: `Bearer ${manualToken}` } } 
        : {};
    
    const response = await api.get('/profile', config);
    return response?.data;
}

async function addProfile(api: AxiosInstance, data: ProfileData) {
    let response;
    try{
        response = await api.post('/profile', data);
    }catch(errors: any){
        throw errors;
    }
    return response?.data;
}

async function editProfile(api: AxiosInstance, data: ProfileData) {
    let response;
    try{
        response = await api.patch('/profile', data);
    }catch(errors: any){
        throw errors;
    }
    return response?.data;
}


async function generateApiKey(api: AxiosInstance): Promise<string> {
    let response;
    try{
        response = await api.post("/auth/keys");
    }catch(errors: any){
        throw errors;
    }
    return response?.data;
}

async function getApiKey(api: AxiosInstance): Promise<string> {
    let response;
    try{
        response = await api.get<string>("/auth/key");
    }catch(errors: any){
        throw errors;
    }
    return response?.data;
}



export {
    getPublicProfile,
    getPublicProfileById,
    sendFriendRequest,
    editAvatar,
    isFriend,
    getPrivateProfile,
    addProfile,
    editProfile,
    generateApiKey,
    getApiKey
}