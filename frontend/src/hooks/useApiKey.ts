import {useMutation, useQuery} from "@tanstack/react-query";
import useApiPrivate from "./useApiPrivate.ts";
import {generateApiKey, getApiKey} from "../api/userApi.ts";
import {useAuth} from "../context/AuthProvider.tsx";


export const useGenApiKey = () => {
    const api = useApiPrivate();
    return useMutation({
        mutationFn: async () => {
            return await generateApiKey(api);
        }
    })
}

export const useGetApiKey = () => {
    const api = useApiPrivate();
    const {user, accessToken} = useAuth();
    return useQuery({
        queryKey: ["apiKey", user?.id],
        enabled: !!accessToken && !!user?.id,
        queryFn: () => getApiKey(api)
    })
}