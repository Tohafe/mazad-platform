import {useEffect, useMemo, useState} from "react";
import {useAuctions} from "../hooks/useAuctions.ts";
import FilterList, {type AppliedFilter} from "../components/Filter/FilterList.tsx";
import ItemGrid from "../components/Grid/ItemGrid.tsx";
import Pagination from "../components/Pagination.tsx";
import CategorySection from "../sections/CategorySection.tsx";
import type {Category} from "../types/category.ts";
import {useSearchParams} from "react-router-dom";
import type {AuctionFilters} from "../types/item.ts";
import {mapFiltersToQuery} from "../lib/filterMapper.ts";

const CategoryAuctions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
    const filters: AuctionFilters = useMemo(() => mapFiltersToQuery(appliedFilters), [appliedFilters]);
    const [id, setId] = useState<number>(0)

    const page = useMemo(() => {
        const pageNum = Number(searchParams.get('page')) || 1;
        return pageNum - 1;
    }, [searchParams]);

    const {data, isLoading} = useAuctions({page: page, size: 16, status: "ACTIVE" , categoryId: id, ...filters});

    useEffect(() => {
        setAppliedFilters([]);
        setSearchParams({page: "1"}, {replace: true})
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [id])

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [page]);

    const onCategoryChange = (category: Category) => {
        setId(category.id);
    }

    const onPageChange = (pageNum: number) => {
        setSearchParams({page: pageNum.toString()})
    }

    const handleApplyFilters = (appliedFilters: AppliedFilter[]) => {
        setAppliedFilters(appliedFilters);
        setSearchParams({page: "1"}, {replace: true})
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (isLoading || !data) return <div>Loading...</div>;

    return <div className="flex flex-col gap-6 w-full max-w-305">
        <div className="relative left-1/2 -mb-4 -ml-[50vw] w-screen h-10 bg-gray-50 "></div>
        <CategorySection onCategoryChange={onCategoryChange} className="h-21 max-w-305"/>
        <FilterList appliedFilters={appliedFilters} onApplyFilters={handleApplyFilters} />
        <ItemGrid auctions={data.content} className="h-full w-full"/>
        <Pagination page={data.page.number + 1} totalPages={data.page.totalPages} onPageChange={onPageChange}
                    className="pt-10"/>
    </div>
};

export default CategoryAuctions;