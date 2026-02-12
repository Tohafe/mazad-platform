import type {Page} from "../types/pagination.ts";
import type {ItemSummary} from "../types/item.ts";
import api from "./axios.ts"

export async function fetchAuctions(page = 0, size = 15): Promise<Page<ItemSummary>> {
    const response = await api.get<Page<ItemSummary>>("/items", {
        params: {page, size}
    })
    return response.data as Page<ItemSummary>;
}