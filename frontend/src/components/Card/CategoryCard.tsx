import {cn} from "../../lib/utils.ts";

export interface Category {
    name: string;
    imageUrl: string;
    color: string
}

interface CategoryCardProps {
    className?: string;
    category: Category
}


const CategoryCard = ({className = "", category}: CategoryCardProps) => {
    const baseStyles = "flex flex-row items-center justify-between bg-blue-200 aspect-5/2 p-2 md:p-4 cursor-pointer";
    return <div className={cn(baseStyles, className)}
                style={{backgroundColor: category.color}}>
        <span className="text-black flex-2 h-full w-full font-serif font-semibold text-sm md:text-lg line-clamp-3">{category.name}</span>
        <img className=" flex-1 h-full w-full aspect-square object-cover rounded-full" src={category.imageUrl}
             alt="Not Found"/>
    </div>
}

export default CategoryCard