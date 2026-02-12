import {useQuery} from "@tanstack/react-query";
import {fetchCategories, fetchPopularCategories} from "../api/categories.ts";


export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchCategories()
    })
}


export const usePopularCategories = () => {
    return useQuery({
        queryKey: ["popular-categories"],
        queryFn: () => fetchPopularCategories()
    })
}
