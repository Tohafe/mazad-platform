import {useSearchParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import FilterList, {type AppliedFilter} from "../components/Filter/FilterList.tsx";
import type {AuctionFilters} from "../types/item.ts";
import {mapFiltersToQuery} from "../lib/filterMapper.ts";
import {useAuctions} from "../hooks/useAuctions.ts";
import ItemGrid from "../components/Grid/ItemGrid.tsx";
import Pagination from "../components/Pagination.tsx";

const SearchAuctions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
    const filters: AuctionFilters = useMemo(() => mapFiltersToQuery(appliedFilters), [appliedFilters]);

    const query = searchParams.get('q') ?? "";

    const page = useMemo(() => {
        const pageNum = Number(searchParams.get('page')) || 1;
        return pageNum - 1;
    }, [searchParams]);

    const {data, isLoading} = useAuctions({page: page, size: 16, keyword: query, ...filters});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [page]);

    const onPageChange = (pageNum: number) => {
        setSearchParams({page: pageNum.toString(), q: query})
    }

    const handleApplyFilters = (appliedFilters: AppliedFilter[]) => {
        setAppliedFilters(appliedFilters);
        setSearchParams({page: "1", q: query})
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (isLoading || !data) return <div>Loading...</div>;

    return <div className="flex flex-col gap-6 w-full max-w-305">
        <div className="relative left-1/2 -mb-4 -ml-[50vw] w-screen h-10 bg-gray-50 "></div>

        <div className="flex justify-between gap-4">
            <div className="flex flex-col gap-4">
                <h1 className="text-5xl font-semibold font-serif">
                    Search results{query ? ` for "${query}"` : ""}
                </h1>
                <span className="text-base text-secondary">
                        {data.page.totalElements} results
                    </span>
            </div>
        </div>

        <FilterList appliedFilters={appliedFilters} onApplyFilters={handleApplyFilters} />
        <ItemGrid auctions={data.content} compact={false} className="h-full w-full"/>
        <Pagination page={data.page.number + 1} totalPages={data.page.totalPages} onPageChange={onPageChange}
                    className="pt-10"/>
    </div>
};

export default SearchAuctions;