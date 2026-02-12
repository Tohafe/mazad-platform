import type {Category} from "../types/category.ts";
import api from "./axios.ts";


export async function fetchCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>("/categories");
    return response.data;
}