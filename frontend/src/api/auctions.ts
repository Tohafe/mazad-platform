import type {Page} from "../types/pagination.ts";
import type {AuctionFilters, AuctionSummary, CategorizedAuctions} from "../types/item.ts";
import api from "./axios.ts"

export async function fetchAuctions(auctionFilters: AuctionFilters = {}): Promise<Page<AuctionSummary>> {
    const {page = 0, size = 15, ...filters} = auctionFilters;
    const response = await api.get<Page<AuctionSummary>>("/items", {
        params: {page, size, ...filters}
    })
    return response.data as Page<AuctionSummary>;
}



export async function fetchCategorizedAuctions(categories_limit: number, items_limit: number): Promise<CategorizedAuctions[]> {
    const response = await api.get<CategorizedAuctions[]>("/catalog", {
        params: {categories_limit, items_limit}
    });
    return response.data;
}


export async function fetchEndingSoonAuctions(hours: number, limit: number): Promise<AuctionSummary[]> {
    const response = await api.get<AuctionSummary[]>("/items/ending-soon", {
        params: {hours, limit}
    });
    return response.data;
}