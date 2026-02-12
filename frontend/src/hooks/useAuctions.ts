import { useQuery } from "@tanstack/react-query";
import { fetchAuctions } from "../api/auctions";


export const useAuctions = (page: number, size: number) => {
    return useQuery({
        queryKey: ["auctions", page, size],
        queryFn: () => fetchAuctions(page, size)
    })
}