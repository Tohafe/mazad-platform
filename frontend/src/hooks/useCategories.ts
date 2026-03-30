import {useQuery} from "@tanstack/react-query";
import {fetchCategories, fetchPopularCategories} from "../api/categories.ts";
import api from "../api/axios.ts";


export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchCategories(api)
    })
}


export const usePopularCategories = () => {
    return useQuery({
        queryKey: ["popular-categories"],
        queryFn: () => fetchPopularCategories(api)
    })
}
