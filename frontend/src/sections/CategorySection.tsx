import Tab, {type IconKey} from "../components/Card/Tab.tsx";
import {useRef, useState} from "react";
import IconButton from "../components/Button/IconButton.tsx";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import {useSearchParams} from "react-router-dom"
import {cn} from "../lib/utils.ts";

interface Tab {
    id: number;
    name: string;
    slug: string;
    icon: IconKey
}

export const DEFAULT_TAB: Tab = {
    id: 0,
    name: "This Week",
    slug: "this_week",
    icon: "BiSearch",
};

const tabs: Tab[] = [
    DEFAULT_TAB,
    { id: 1, name: "Trending", slug: "trending", icon: "LiaFireAltSolid" },
    { id: 2, name: "Watches", slug: "watches", icon: "LuWatch" },
    { id: 3, name: "Art", slug: "art", icon: "LuPalette" },
    { id: 4, name: "Jewelry", slug: "jewelry", icon: "LuGem" },
    { id: 5, name: "Cars", slug: "cars", icon: "LuCar" },
    { id: 6, name: "Collectibles", slug: "collectibles", icon: "LuPackage" },
    { id: 7, name: "Fashion", slug: "fashion", icon: "LuShirt" },
    { id: 8, name: "Sneakers", slug: "sneakers", icon: "LuFootprints" },
    { id: 9, name: "Comics", slug: "comics", icon: "LuBookOpen" },
    { id: 10, name: "Coins", slug: "coins", icon: "LuCoins" },
    { id: 11, name: "Electronics", slug: "electronics", icon: "LuSmartphone" },
    { id: 13, name: "Design", slug: "design", icon: "LuPenTool" },
    { id: 14, name: "Photography", slug: "photography", icon: "LuCamera" },
    { id: 15, name: "Luxury Bags", slug: "luxury-bags", icon: "LuShoppingBag" },
    { id: 16, name: "Trading Cards", slug: "trading-cards", icon: "LuLayers" },
    { id: 17, name: "Memorabilia", slug: "memorabilia", icon: "LuTrophy" },
];


interface CategorySectionProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}


const CategorySection = ({className = "", ...props}: CategorySectionProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedTab = searchParams.get("tab") || DEFAULT_TAB.slug;

    const checkScrollPos = () => {
        const nav = navRef.current;
        if (!nav) return;
        if (nav.scrollLeft <= 0) setCanScrollLeft(false);
        else setCanScrollLeft(true)

        if (nav.scrollLeft + nav.clientWidth + 1 >= nav.scrollWidth) setCanScrollRight(false);
        else setCanScrollRight(true);
    }

    const scrollRight = () => {
        const nav = navRef.current;
        if (!nav) return;
        nav.scrollTo({
            left: nav.scrollLeft + nav.clientWidth,
            behavior: "smooth"
        })
    }

    const scrollLeft = () => {
        const nav = navRef.current;
        if (!nav) return;
        nav.scrollTo({
            left: nav.scrollLeft - nav.clientWidth,
            behavior: "smooth"
        })
    }

    const onTabClick = (tab: Tab) => {
        if (tab != DEFAULT_TAB)
            setSearchParams({tab: tab.slug});
        else {
            searchParams.delete("tab");
            setSearchParams(searchParams, {replace: true});
        }
    }

    const baseStyles = "relative items-center w-full h-full";
    return (
        <div className={cn(baseStyles, className,)} {...props}>
            <IconButton className={cn("absolute left-0 bg-linear-to-r from-white from-50% to-transparent w-16 h-full hover:opacity-100", canScrollLeft ? "visible" : "invisible")} onClick={scrollLeft}
                        icon={MdKeyboardArrowLeft} iconClassName="text-brand"/>
            <IconButton className={cn("absolute right-0 bg-linear-to-l from-white from-50% to-transparent w-16 h-full hover:opacity-100",canScrollRight ? "visible" : "invisible")} onClick={scrollRight}
                        icon={MdKeyboardArrowRight} iconClassName="text-brand"/>
            <nav ref={navRef} onScroll={checkScrollPos}
                 className="flex flex-row h-full w-full gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <Tab variant={selectedTab === tab.slug ? "selected" : "unselected"}
                         onClick={() => onTabClick(tab)} iconKey={tab.icon}>{tab.name}</Tab>
                ))}
            </nav>
        </div>
    )
}


export default CategorySection