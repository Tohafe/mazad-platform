import type {Page} from "../types/pagination.ts";
import type {AuctionFilters, AuctionSummary, CategorizedAuctions} from "../types/item.ts";
import type {AxiosInstance} from "axios";

export async function fetchAuctions(api: AxiosInstance, auctionFilters: AuctionFilters = {}): Promise<Page<AuctionSummary>> {
    const {page = 0, size = 15, ...filters} = auctionFilters;
    const response = await api.get<Page<AuctionSummary>>("/items", {
        params: {page, size, ...filters}
    })
    return response.data as Page<AuctionSummary>;
}

export async function fetchMyAuctions(api: AxiosInstance, auctionFilters: AuctionFilters = {}): Promise<Page<AuctionSummary>> {
    const {page = 0, size = 12, ...filters} = auctionFilters;
    const response = await api.get<Page<AuctionSummary>>("/items/me", {
        params: {page, size, ...filters}
    })
    return response.data as Page<AuctionSummary>;
}

export async function fetchWonAuctions(api: AxiosInstance, auctionFilters: AuctionFilters = {}): Promise<Page<AuctionSummary>> {
    const response = await api.get<Page<AuctionSummary>>("/items/won", {
        params: {page: auctionFilters.page, size: auctionFilters.size},
    })
    return response.data as Page<AuctionSummary>;
}


export async function fetchCategorizedAuctions(api: AxiosInstance, categories_limit: number, items_limit: number): Promise<CategorizedAuctions[]> {
    const response = await api.get<CategorizedAuctions[]>("/catalog", {
        params: {categories_limit, items_limit}
    });
    return response.data;
}


export async function fetchEndingSoonAuctions(api: AxiosInstance, hours: number, limit: number): Promise<AuctionSummary[]> {
    const response = await api.get<AuctionSummary[]>("/items/ending-soon", {
        params: {hours, limit}
    });
    return response.data;
}

export async function cancelAuction(api: AxiosInstance, id: number) {
    const response = await api.post(`/items/${id}/cancel`)
    return response.data;
}

export async function signOut(api: AxiosInstance) {
     await api.post("/auth/logout");
}