import { useQuery } from "@tanstack/react-query";
import {fetchAuctions, fetchCategorizedAuctions, fetchEndingSoonAuctions} from "../api/auctions";
import type {AuctionFilters} from "../types/item.ts";


export const useAuctions = (filters: AuctionFilters) => {
    return useQuery({
        queryKey: ["auctions","list", filters],
        queryFn: () => fetchAuctions(filters)
    })
}

export const useCategoriesAuctions = (categories_limit: number, items_limit: number) => {
    return useQuery({
        queryKey: ["auctions", "categorized", categories_limit, items_limit],
        queryFn: () => fetchCategorizedAuctions(categories_limit, items_limit)
    })
}

export const useEndingSoonAuctions = (hours: number, limit: number) => {
    return useQuery({
        queryKey: ["auctions", "ending-soon", hours, limit],
        queryFn: () => fetchEndingSoonAuctions(hours, limit)
    })
}