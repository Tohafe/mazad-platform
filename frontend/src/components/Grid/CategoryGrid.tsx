import type {HTMLAttributes} from "react";
import {cn} from "../../lib/utils.ts";
import CategoryCard from "../Card/CategoryCard.tsx";
import type {Category} from "../../types/category.ts";


interface CategoryGridProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    categories: Category[];
    onCategoryClick?: (category: Category) => void;

}

const CategoryGrid = ({className = "", categories, onCategoryClick, ...props}: CategoryGridProps) => {

    const baseStyles = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-base text-black font-semibold"></h2>
            <div className={cn(baseStyles, className)} {...props}>
                {categories.map((category) => <CategoryCard key={category.id} onClick={() => onCategoryClick && onCategoryClick(category)}
                                                            category={category}/>)}
            </div>
        </div>
    );
};


export default CategoryGrid