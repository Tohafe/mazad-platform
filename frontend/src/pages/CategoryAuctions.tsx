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
import PLACE_HOLDER from '../assets/place_holder.svg'

const CategoryAuctions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
    const filters: AuctionFilters = useMemo(() => mapFiltersToQuery(appliedFilters), [appliedFilters]);
    const [category, setCategory] = useState<Category | null>(null)

    const page = useMemo(() => {
        const pageNum = Number(searchParams.get('page')) || 1;
        return pageNum - 1;
    }, [searchParams]);

    const {data, isLoading} = useAuctions({
        page: page,
        size: 16,
        status: "ACTIVE",
        categoryId: category?.id, ...filters
    });

    useEffect(() => {
        setAppliedFilters([]);
        setSearchParams({page: "1"}, {replace: true})
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [category])

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [page]);

    const onCategoryChange = (mCategory: Category) => {
        setCategory(mCategory);
    }

    const onPageChange = (pageNum: number) => {
        setSearchParams({page: pageNum.toString()})
    }

    const handleApplyFilters = (appliedFilters: AppliedFilter[]) => {
        setAppliedFilters(appliedFilters);
        setSearchParams({page: "1"}, {replace: true})
        window.scrollTo({top: 0, behavior: "smooth"});
    }

    if (isLoading || !data) return <div>Loading...</div>;

    return <div className="flex flex-col gap-6 w-full max-w-305">
        <div className="relative left-1/2 -mb-4 -ml-[50vw] w-screen h-10 bg-gray-50 "></div>
        <CategorySection onCategoryChange={onCategoryChange} className="h-21 max-w-305"/>
        {category && <CategoryInfo category={category}/>}
        <FilterList appliedFilters={appliedFilters} onApplyFilters={handleApplyFilters}/>
        <ItemGrid auctions={data.content} className="h-full w-full"/>
        <Pagination page={data.page.number + 1} totalPages={data.page.totalPages} onPageChange={onPageChange}
                    className="pt-10"/>
    </div>
};

const CategoryInfo = ({category}: { category: Category }) => {
    return <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex justify-between gap-4">
            <img
                className="flex-1 sm:flex-none shrink-0 w-full h-48 sm:w-64 sm:h-64 aspect-square object-cover"
                src={category.imageUrl}
                alt={category.name}
                onError={(e) => {
                    e.currentTarget.src = PLACE_HOLDER
                }}
            />
            <h1 className="flex-1 w-full truncate sm:hidden bg-muted p-4 text-2xl text-black font-serif font-bold">{category.name}</h1>
        </div>
        <div className="hidden sm:flex flex-col gap-4 p-6 md:pr-40 bg-muted">
            <h1 className="text-5xl text-black font-serif font-bold">{category.name}</h1>
            <p className="font-nunito text-lg text-secondary font-semibold">{category.description}</p>
        </div>
        <p className="block sm:hidden  font-nunito text-lg text-secondary font-semibold">{category.description}</p>


    </div>
}

export default CategoryAuctions;