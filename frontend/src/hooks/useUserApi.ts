import type { AxiosInstance } from "axios";
import { editAvatar, getPublicProfile, getPublicProfileById, isFriend, sendFriendRequest } from "../api/userApi";
import useApiPrivate from "./useApiPrivate";
import type AvatarData from "../types/AvatarData";

export default function useUserApi(){
    const api: AxiosInstance = useApiPrivate();

    return {
        getPublicProfile: async (username: string) => {
            return await getPublicProfile(api, username);
        },
        getPublicProfileById: async (userId: string) => {
            return await getPublicProfileById(api, userId);
        },
        sendFriendRequest: async (username: string) => {
            return await sendFriendRequest(api, username);
        },
        editAvatar: async (avatarData: AvatarData) => {
            return await editAvatar(api, avatarData);
        },
        isFriend: async (friendId: string) => {
            return await isFriend(api, friendId);
        }
    };
}