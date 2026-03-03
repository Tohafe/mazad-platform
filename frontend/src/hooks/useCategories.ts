import {useQuery} from "@tanstack/react-query";
import {fetchCategories, fetchPopularCategories} from "../api/categories.ts";
import useApiPrivate from "./useApiPrivate.ts";


export const useCategories = () => {
    const api = useApiPrivate();
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => fetchCategories(api)
    })
}


export const usePopularCategories = () => {
    const api = useApiPrivate();
    return useQuery({
        queryKey: ["popular-categories"],
        queryFn: () => fetchPopularCategories(api)
    })
}
