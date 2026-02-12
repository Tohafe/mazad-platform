import {useQuery} from "@tanstack/react-query";
import {fetchCategories} from "../api/categories.ts";


export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchCategories()
    })
}