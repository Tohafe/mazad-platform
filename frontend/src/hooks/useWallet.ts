import useApiPrivate from "./useApiPrivate.ts";
import {useAuth} from "../context/AuthProvider.tsx";
import {useQuery} from "@tanstack/react-query";
import {getUserWallet} from "../api/userApi.ts";

export const useWallet = () => {
    const api = useApiPrivate()
    const {user, accessToken} = useAuth();
    return useQuery({
        queryKey: ["availableBalance", user?.id],
        enabled: !!accessToken && !!user?.id,
        queryFn: () => getUserWallet(api)
    })
}