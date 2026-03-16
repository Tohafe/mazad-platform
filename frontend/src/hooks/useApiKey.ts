import {useMutation, useQuery} from "@tanstack/react-query";
import useApiPrivate from "./useApiPrivate.ts";
import {generateApiKey, getApiKey} from "../api/userApi.ts";


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
    return useQuery({
        queryKey: ["apiKey"],
        queryFn: () => getApiKey(api)
    })
}