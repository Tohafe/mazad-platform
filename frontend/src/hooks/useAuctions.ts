import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchAuctions, fetchCategorizedAuctions, fetchEndingSoonAuctions, signOut} from "../api/auctions";
import type {AuctionFilters} from "../types/item.ts";
import useApiPrivate from "./useApiPrivate.ts";
import {useAuth} from "../context/AuthProvider.tsx";


export const useAuctions = (filters: AuctionFilters) => {
    const api = useApiPrivate();
    return useQuery({
        queryKey: ["auctions","list", filters],
        queryFn: () => fetchAuctions(api, filters)
    })
}

export const useCategoriesAuctions = (categories_limit: number, items_limit: number) => {
    const api = useApiPrivate();
    return useQuery({
        queryKey: ["auctions", "categorized", categories_limit, items_limit],
        queryFn: () => fetchCategorizedAuctions(api, categories_limit, items_limit)
    })
}

export const useEndingSoonAuctions = (hours: number, limit: number) => {
    const api = useApiPrivate();
    return useQuery({
        queryKey: ["auctions", "ending-soon", hours, limit],
        queryFn: () => fetchEndingSoonAuctions(api, hours, limit)
    })
}


export const useSignOut = () => {
    const api = useApiPrivate();
    const {setAccessToken} = useAuth();
    return useMutation({
        mutationFn: () => {
            setAccessToken(null);
            return signOut(api)
        }
    })
}


