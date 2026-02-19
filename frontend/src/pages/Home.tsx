import CategorySection, {DEFAULT_CATEGORY} from "../sections/CategorySection.tsx";
import ItemCarousel from "../components/Carousel/ItemCarousel.tsx";
import HeroCarousel from "../components/Carousel/HeroCarousel.tsx";
import CategoryGrid from "../components/Grid/CategoryGrid.tsx";
import {useSearchParams} from "react-router-dom";
import ItemGrid from "../components/Grid/ItemGrid.tsx";
import FilterList from "../components/FilterList.tsx";
import {useAuctions, useEndingSoonAuctions} from "../hooks/useAuctions.ts";
import {useCategories, usePopularCategories} from "../hooks/useCategories.ts";
import type {Category} from "../types/category.ts";
import Pagination from "../components/Pagination.tsx";
import {useEffect, useState} from "react";

const HomePageContent = () => {
    const {data: Categories = [], isLoading: LoadingCategories} = usePopularCategories()
    const {data: EndingSoonAuctions = [], isLoading: LoadingEndingSoonAuctions} = useEndingSoonAuctions(128, 10);
    return <div className="flex flex-col gap-10 items-center justify-center max-w-305  w-full py-6">
        <HeroCarousel/>
        {!LoadingEndingSoonAuctions &&
            <ItemCarousel auctions={EndingSoonAuctions} carouselTitle="Auctions ending soon"/>}
        {!LoadingCategories && <CategoryGrid categories={Categories}/>}
        <ItemCarousel auctions={EndingSoonAuctions} carouselTitle="You might also like"/>
        <ItemCarousel auctions={EndingSoonAuctions} carouselTitle="Recently viewed"/>
    </div>
}

const CategoryPageContent = ({category}: { category: Category | undefined }) => {
    const [page, setPage] = useState<number>(0);
    const {data, isLoading} = useAuctions({page: page, size: 16, categoryId: category?.id});

    useEffect(() => window.scrollTo({top: 0, behavior: 'smooth'}), [page])

    if (isLoading || !data) return <div>Loading...</div>;
    return <div className="flex flex-col gap-6 w-full py-8 max-w-305">
        <FilterList/>
        <ItemGrid items={data.content} noTitle={true} className="h-full w-full"/>
        <Pagination page={data.page.number + 1} totalPages={data.page.totalPages} onPageChange={(pageNum: number) => {
            setPage(pageNum - 1);
        }} className="pt-10"/>
    </div>
}


const Home = () => {
    const [searchParams] = useSearchParams();
    const categorySlug = searchParams.get("category") || DEFAULT_CATEGORY.slug;
    const isDefaultCategory = categorySlug === DEFAULT_CATEGORY.slug;
    const {data: categories = [], isLoading: LoadingCategories} = useCategories();
    const selectedCategory = categories.find((category) => category.slug === categorySlug)

    return <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-screen h-10 bg-gray-50"></div>
        {/*Home Page Header*/}
        {!LoadingCategories && <CategorySection data={categories} className="h-21 max-w-305"/>}

        {/*/!*Home Page Content*!/*/}
        {isDefaultCategory && <HomePageContent/>}
        {!isDefaultCategory && <CategoryPageContent category={selectedCategory}/>}

    </div>
}

export default Home