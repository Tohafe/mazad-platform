import Tab from "../components/Card/Tab.tsx";
import {useRef, useState} from "react";
import IconButton from "../components/Button/IconButton.tsx";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import {useSearchParams} from "react-router-dom"
import {cn} from "../lib/utils.ts";
import type {Category} from "../types/category.ts";

export const DEFAULT_CATEGORY: Category = {
    id: 0,
    name: "This Week",
    slug: "this_week",
    description: "desc",
    imageUrl: "image",
    hexColor: "#color",
    icon: "LiaFireAltSolid",
};

interface CategorySectionProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    data: Category[];
}


const CategorySection = ({className = "", data, ...props}: CategorySectionProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    const categories = [DEFAULT_CATEGORY, ...data];
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedTab = searchParams.get("category") || DEFAULT_CATEGORY.slug;

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

    const onTabClick = (category: Category) => {
        if (category != DEFAULT_CATEGORY)
            setSearchParams({category: category.slug});
        else {
            searchParams.delete("category");
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
                {categories.map((tab) => (
                    <Tab variant={selectedTab === tab.slug ? "selected" : "unselected"}
                         onClick={() => onTabClick(tab)} iconKey={tab.icon}>{tab.name}</Tab>
                ))}
            </nav>
        </div>
    )
}


export default CategorySection