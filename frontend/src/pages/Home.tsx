import HeaderSection from "../sections/HeaderSection.tsx";
import CategorySection, {DEFAULT_CATEGORY} from "../sections/CategorySection.tsx";
import ItemCarousel from "../components/Carousel/ItemCarousel.tsx";
import HeroCarousel from "../components/Carousel/HeroCarousel.tsx";
import CategoryGrid from "../components/Grid/CategoryGrid.tsx";
import {useSearchParams} from "react-router-dom";
import ItemGrid from "../components/Grid/ItemGrid.tsx";
import FilterList from "../components/FilterList.tsx";
import {useAuctions} from "../hooks/useAuctions.ts";
import type {ItemSummary} from "../types/item.ts";
import type {Page} from "../types/pagination.ts";
import {useCategories} from "../hooks/useCategories.ts";

const HomePageContent = () => {
    return <div className="flex flex-col gap-18  w-full py-12 max-w-305">
        <HeroCarousel/>
        <CategoryGrid/>
        <ItemCarousel carouselTitle="Auctions ending soon"/>
        <ItemCarousel carouselTitle="You might also like"/>
        <ItemCarousel carouselTitle="Recently viewed"/>
    </div>
}

const CategoryPageContent = ({data}: { data: Page<ItemSummary> | undefined }) => {
    return <div className="flex flex-col gap-4  w-full py-8 max-w-305">
        <FilterList/>
        {data && <ItemGrid data={data} noTitle={true} className="h-full w-full"/>}
    </div>
}

const HomePageHeader = () => {
    const {data, isLoading} = useCategories();

    if (isLoading) return (<div>Categories Is Loading...</div>)
    return <div className="flex flex-col  items-center gap-2 w-full max-w-305">
        <HeaderSection className="w-full"/>
        <div className="w-screen h-10 bg-gray-50"></div>
        { data && <CategorySection data={[DEFAULT_CATEGORY, ...data]} className="w-full h-21"/>}
    </div>
}


const Home = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") || DEFAULT_CATEGORY.slug;
    const isDefaultCategory = category === DEFAULT_CATEGORY.slug;
    const {data, isLoading} = useAuctions(3, 20);

    if (isLoading) return (<div>Is Loading...</div>)


    return <div className="flex bg-white flex-col px-12 w-screen h-screen items-center gap-0 overflow-x-hidden">

        {/*Home Page Header*/}
        <HomePageHeader/>

        {/*/!*Home Page Content*!/*/}
        {isDefaultCategory && <HomePageContent/>}
        {!isDefaultCategory && <CategoryPageContent data={data}/>}

    </div>
}

export default Home