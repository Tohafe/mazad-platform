import { useQuery } from "@tanstack/react-query";
import {fetchAuctions, fetchCategorizedAuctions, fetchEndingSoonAuctions} from "../api/auctions";
import type {AuctionFilters} from "../types/item.ts";


export const useAuctions = (filters: AuctionFilters) => {
    return useQuery({
        queryKey: ["auctions", filters],
        queryFn: () => fetchAuctions(filters)
    })
}

export const useCategoriesAuctions = (categories_limit: number, items_limit: number) => {
    return useQuery({
        queryKey: ["categorized-auctions", categories_limit, items_limit],
        queryFn: () => fetchCategorizedAuctions(categories_limit, items_limit)
    })
}

export const useEndingSoonAuctions = (hours: number, limit: number) => {
    return useQuery({
        queryKey: ["ending-soon-auctions", hours, limit],
        queryFn: () => fetchEndingSoonAuctions(hours, limit)
    })
}