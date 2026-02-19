import type {Category} from "../types/category.ts";
import api from "./axios.ts";


export async function fetchCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>("/categories");
    return response.data;
}

export async function fetchPopularCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>("/categories");
    return response.data.slice(0, 8);
}
