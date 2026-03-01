import type {Category} from "../types/category.ts";
import type {AxiosInstance} from "axios";

export async function fetchCategories(api: AxiosInstance): Promise<Category[]> {
    const response = await api.get<Category[]>("/categories");
    return response.data;
}

export async function fetchPopularCategories(api: AxiosInstance): Promise<Category[]> {
    const response = await api.get<Category[]>("/categories");
    return response.data.slice(0, 8);
}
