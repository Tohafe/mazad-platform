import type {Page} from "../types/pagination.ts";
import type {AuctionFilters, AuctionSummary, CategorizedAuctions} from "../types/item.ts";
import type {AxiosInstance} from "axios";

export async function fetchAuctions(api: AxiosInstance, auctionFilters: AuctionFilters = {}): Promise<Page<AuctionSummary>> {
    // const api = useApiPrivate();
    const {page = 0, size = 15, ...filters} = auctionFilters;
    const response = await api.get<Page<AuctionSummary>>("/items", {
        params: {page, size, status: "ACTIVE", ...filters}
    })

    console.log("Fetching auctions with filters:", response);
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

export async function signOut(api: AxiosInstance) {
    const response = await api.post("/auth/logout");
    console.log("User signed out successfully, ", response.data);
}