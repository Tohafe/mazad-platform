import CategorySection from "../sections/CategorySection.tsx";
import ItemCarousel from "../components/Carousel/ItemCarousel.tsx";
import HeroCarousel from "../components/Carousel/HeroCarousel.tsx";
import CategoryGrid from "../components/Grid/CategoryGrid.tsx";
import {useAuctions, useEndingSoonAuctions} from "../hooks/useAuctions.ts";
import {usePopularCategories} from "../hooks/useCategories.ts";

const HomePageContent = () => {
    const {data: Categories = []} = usePopularCategories()
    const {data: EndingSoonAuctions = []} = useEndingSoonAuctions(128, 10);
    const {data: extraAuctions} = useAuctions({page: 0, size: 20, status: "ACTIVE"});
    const recentlyAdded = extraAuctions?.content.slice(0, 10) ?? []
    const mightLikeAuctions = extraAuctions?.content.slice(10, 20) ?? []
    return <div className="flex flex-col gap-10 items-center justify-center max-w-305  w-full py-6">
        <HeroCarousel/>
        {EndingSoonAuctions.length > 0 &&
            <ItemCarousel auctions={EndingSoonAuctions} carouselTitle="Auctions ending soon"/>}
        {Categories.length > 0 && <CategoryGrid categories={Categories}/>}
        {mightLikeAuctions.length > 0 && <ItemCarousel auctions={mightLikeAuctions} carouselTitle="You might also like"/>}
        {recentlyAdded.length > 0 && <ItemCarousel auctions={recentlyAdded} carouselTitle="Recently added"/>}
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