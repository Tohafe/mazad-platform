import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from '../api/axios.ts'
import type {AuctionFilters} from "../types/item.ts";
import useApiPrivate from "./useApiPrivate.ts";
import { useAuth } from "../context/AuthProvider.tsx";
import {
    cancelAuction,
    fetchAuctions,
    fetchCategorizedAuctions,
    fetchEndingSoonAuctions,
    fetchMyAuctions, fetchWonAuctions,
    signOut
} from "../api/auctions";


export const useAuctions = (filters: AuctionFilters) => {
    return useQuery({
        queryKey: ["auctions","list", filters],
        queryFn: () => fetchAuctions(api, filters)
    })
}

export const useMyAuctions = (filters: AuctionFilters) => {
    const api = useApiPrivate();
    return useQuery({
        queryKey: ["my-auctions","list", filters],
        queryFn: () => fetchMyAuctions(api, filters)
    })
}
export const useWonAuctions = (filters: AuctionFilters) => {
    const api = useApiPrivate();
    return useQuery({
        queryKey: ["won-auctions","list"],
        queryFn: () => fetchWonAuctions(api, filters)
    })
}

export const useCategoriesAuctions = (categories_limit: number, items_limit: number) => {
    return useQuery({
        queryKey: ["auctions", "categorized", categories_limit, items_limit],
        queryFn: () => fetchCategorizedAuctions(api, categories_limit, items_limit)
    })
}

export const useEndingSoonAuctions = (hours: number, limit: number) => {
    return useQuery({
        queryKey: ["auctions", "ending-soon", hours, limit],
        queryFn: () => fetchEndingSoonAuctions(api, hours, limit)
    })
}

export const useCancelAuction = () => {
    const api = useApiPrivate();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => cancelAuction(api, id),
        onSuccess: async () => await queryClient.invalidateQueries({queryKey: ["my-auctions"]})
    })
}

export const useSignOut = () => {
    const api = useApiPrivate();
    const {setUser, setAccessToken} = useAuth();
    
    return useMutation({
        mutationFn: async () => {
                signOut(api).then(() => {
                    setUser(null);
                    setAccessToken(null);
                });
        }
    })
}


