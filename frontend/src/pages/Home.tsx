import HeaderSection from "../sections/HeaderSection.tsx";
import CategorySection, {DEFAULT_TAB} from "../sections/CategorySection.tsx";
import ItemCarousel from "../components/Carousel/ItemCarousel.tsx";
import HeroCarousel from "../components/Carousel/HeroCarousel.tsx";
import CategoryGrid from "../components/Grid/CategoryGrid.tsx";
import {useSearchParams} from "react-router-dom";
import ItemGrid from "../components/Grid/ItemGrid.tsx";
import FilterList from "../components/FilterList.tsx";

const HomePageContent = () => {
    return <div className="flex flex-col gap-18  w-full py-12 max-w-305">
        <HeroCarousel/>
        <CategoryGrid/>
        <ItemCarousel carouselTitle="Auctions ending soon"/>
        <ItemCarousel carouselTitle="You might also like"/>
        <ItemCarousel carouselTitle="Recently viewed"/>
    </div>
}

const CategoryPageContent = () => {
    return <div className="flex flex-col gap-4  w-full py-8 max-w-305">
        <FilterList/>
        <ItemGrid noTitle={true} className="h-full w-full"/>
    </div>
}


const Home = () => {
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || DEFAULT_TAB.slug;
    const isDefaultTab = tab === DEFAULT_TAB.slug;
    return <div className="flex bg-white flex-col px-12 w-screen h-screen items-center gap-0 overflow-x-hidden">

        {/*Home Page Header*/}
        <div className="flex flex-col  items-center gap-2 w-full max-w-305">
            <HeaderSection className="w-full"/>
            <div className="w-screen h-10 bg-gray-50"></div>
            <CategorySection className="w-full h-21"/>
        </div>

        {/*/!*Home Page Content*!/*/}
        {isDefaultTab && <HomePageContent/>}
        {!isDefaultTab && <CategoryPageContent/>}

    </div>
}

export default Home