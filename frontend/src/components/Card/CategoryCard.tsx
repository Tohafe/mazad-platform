import {cn} from "../../lib/utils.ts";
import type {Category} from "../../types/category.ts";
import {Link} from "react-router-dom";


interface CategoryCardProps {
    className?: string;
    titleClassName?: string;
    imgClassName?: string;
    category: Category;
    onClick?: () => void;
}


const CategoryCard = ({className = "", titleClassName = "", imgClassName = "", category, onClick}: CategoryCardProps) => {
    const baseStyles = "flex flex-row items-center justify-between aspect-5/2 p-2 md:px-4 cursor-pointer overflow-hidden rounded-md"; // Added overflow-hidden and rounded-md for safety

    return (
        <Link onClick={onClick} to={`/c/${category.id}-${category.slug}`} className={cn(baseStyles, className)}
              style={{backgroundColor: category.hexColor}}>

            <span className={cn("flex-1 truncate mr-2 text-sm sm:text-lg text-black font-serif font-semibold md:text-lg", titleClassName)}>
                {category.name}
            </span>

            <img className={cn("shrink-0 w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full", imgClassName)}
                 loading="lazy" src={category.imageUrl}
                 alt="Not Found"/>
        </Link>
    )
}

export default CategoryCard