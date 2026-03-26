import Tab from "../components/Card/Tab.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import IconButton from "../components/Button/IconButton.tsx";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import {useParams} from "react-router-dom"
import {cn} from "../lib/utils.ts";
import type {Category} from "../types/category.ts";
import {useCategories} from "../hooks/useCategories.ts";

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
    onCategoryChange?: (category: Category) => void;
}


export const getCategoryInfo = (idSlug: string) => {
    const [id, ...slugs] = idSlug?.split("-");
    return {id: Number(id), slug: slugs?.join("-")};
}


const CategorySection = ({className = "", onCategoryChange, ...props}: CategorySectionProps) => {
    const navRef = useRef<HTMLDivElement>(null);
    const {data = [], isLoading} = useCategories();
    const categories = [DEFAULT_CATEGORY, ...data];

    const [canScrollRight, setCanScrollRight] = useState(true)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const {idSlug} = useParams();

    const selectedCat = useMemo(() => {
        if (!idSlug) return DEFAULT_CATEGORY;
        const {id} = getCategoryInfo(idSlug)
        return categories.find(cat => cat.id === id) ?? DEFAULT_CATEGORY;
    }, [idSlug, categories]);

    useEffect(() => {
        onCategoryChange?.(selectedCat);
    }, [onCategoryChange, selectedCat]);

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

    const getLink = (category: Category) => {
        if (category.id === DEFAULT_CATEGORY.id)
            return `/`;
        return `/c/${category.id}-${category.slug}`
    }

    if (isLoading) return <div>Loading categories...</div>
    if (data.length === 0) return null;
    const baseStyles = "relative items-center w-full h-full";
    return (
        <>
            {categories.length > 0 && <div className={cn(baseStyles, className,)} {...props}>
                <IconButton
                    className={cn("absolute left-0 bg-linear-to-r from-white from-50% to-transparent w-16 h-full hover:opacity-100", canScrollLeft ? "visible" : "invisible")}
                    onClick={scrollLeft}
                    icon={MdKeyboardArrowLeft} iconClassName="text-brand"/>
                <IconButton
                    className={cn("absolute right-0 bg-linear-to-l from-white from-50% to-transparent w-16 h-full hover:opacity-100", canScrollRight ? "visible" : "invisible")}
                    onClick={scrollRight}
                    icon={MdKeyboardArrowRight} iconClassName="text-brand"/>
                <nav ref={navRef} onScroll={checkScrollPos}
                     className="flex flex-row h-full w-full gap-2 whitespace-nowrap overflow-x-auto no-scrollbar">
                    {categories.map((catTab) => (
                        <Tab link={getLink(catTab)}
                             variant={`${selectedCat?.id === catTab.id ? "selected" : "unselected"}`}
                             key={catTab.id}
                             onClick={() => {
                             }} iconKey={catTab.icon}>{catTab.name}</Tab>
                    ))}
                </nav>
            </div>}
        </>
    )
}


export default CategorySection