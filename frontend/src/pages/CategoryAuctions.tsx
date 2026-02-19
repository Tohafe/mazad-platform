import {useEffect, useState} from "react";
import {useAuctions} from "../hooks/useAuctions.ts";
import FilterList from "../components/FilterList.tsx";
import ItemGrid from "../components/Grid/ItemGrid.tsx";
import Pagination from "../components/Pagination.tsx";
import CategorySection from "../sections/CategorySection.tsx";
import type {Category} from "../types/category.ts";

const CategoryAuctions = () => {
    const [id, setId] = useState<number>(0)
    const [page, setPage] = useState<number>(0);
    const {data, isLoading} = useAuctions({page: page, size: 16, categoryId: id});

    useEffect(() => window.scrollTo({top: 0, behavior: 'smooth'}), [page])

    const onCategoryChange = (category: Category) => {
        setId(category.id);
        setPage(0);
    }

    if (isLoading || !data) return <div>Loading...</div>;

    return <div className="flex flex-col gap-6 w-full max-w-305">
        <div className="relative left-1/2 -mb-4 -ml-[50vw] w-screen h-10 bg-gray-50 "></div>
        <CategorySection onCategoryChange={onCategoryChange} className="h-21 max-w-305"/>
        <FilterList/>
        <ItemGrid items={data.content} noTitle={true} className="h-full w-full"/>
        <Pagination page={data.page.number + 1} totalPages={data.page.totalPages} onPageChange={(pageNum: number) => {
            setPage(pageNum - 1);
        }} className="pt-10"/>
    </div>
};

export default CategoryAuctions;