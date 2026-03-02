import CategorySection from "../sections/CategorySection.tsx";
import ItemCarousel from "../components/Carousel/ItemCarousel.tsx";
import HeroCarousel from "../components/Carousel/HeroCarousel.tsx";
import CategoryGrid from "../components/Grid/CategoryGrid.tsx";
import {useEndingSoonAuctions} from "../hooks/useAuctions.ts";
import {usePopularCategories} from "../hooks/useCategories.ts";

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


const Home = () => {
    return <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-screen h-10 bg-gray-50"></div>
        <CategorySection className="h-21 max-w-305"/>
        {/* /!*Home Page Content*!/ */}
        {<HomePageContent/>}

    </div>
}

export default Home