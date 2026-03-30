import {cn} from "../../lib/utils.ts";
import type {Category} from "../../types/category.ts";
import {Link} from "react-router-dom";


interface CategoryCardProps {
    className?: string;
    category: Category;
    onClick?: () => void;
}


const CategoryCard = ({className = "", category, onClick}: CategoryCardProps) => {
    const baseStyles = "flex flex-row items-center justify-between aspect-5/2 p-2 md:px-4 cursor-pointer";
    return <Link onClick={onClick} to={`/c/${category.id}-${category.slug}`} className={cn(baseStyles, className)}
                style={{backgroundColor: category.hexColor}}>
        <span className="flex-2 text-xs text-black h-full font-serif font-semibold md:text-lg">{category.name}</span>
        <img className="w-8 h-8  md:w-16 md:h-16 object-cover rounded-full" loading="lazy" src={category.imageUrl}
             alt="Not Found"/>
    </Link>
}

export default CategoryCard