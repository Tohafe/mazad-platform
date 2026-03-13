import type { AxiosInstance } from "axios";
import { editAvatar, getPublicProfile, getPublicProfileById, isFriend, sendFriendRequest, getPrivateProfile, addProfile, editProfile } from "../api/userApi";
import useApiPrivate from "./useApiPrivate";
import type AvatarData from "../types/AvatarData";
import type { ProfileData } from "../components/Form/Profile";

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
        },
        getPrivateProfle: async (manualToken?: string) => {
            return await getPrivateProfile(api, manualToken);
        },
        addProfile: async (data: ProfileData) => {
            return await addProfile(api, data);
        },
        editProfile: async (data: ProfileData) => {
            return await editProfile(api, data);
        }
    };
}