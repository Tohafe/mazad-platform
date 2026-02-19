import type {HTMLAttributes} from "react";
import {cn} from "../../lib/utils.ts";
import CategoryCard from "../Card/CategoryCard.tsx";
import type {Category} from "../../types/category.ts";


interface ItemGridProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    categories: Category[]

}

const ItemGrid = ({className = "", categories, ...props}: ItemGridProps) => {

    const baseStyles = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-base text-black font-semibold"></h2>
            <div className={cn(baseStyles, className)} {...props}>
                {categories.map((category) => <CategoryCard category={category}/>)}
            </div>
        </div>
    );
};


export default ItemGrid