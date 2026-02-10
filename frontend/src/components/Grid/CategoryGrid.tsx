import type {HTMLAttributes} from "react";
import {cn} from "../../lib/utils.ts";
import CategoryCard, {type Category} from "../Card/CategoryCard.tsx";


const categories: Category[] = [
    {name: "Men", imageUrl: "src/assets/nature_img.jpg", color: "#3c84d8"},
    {name: "Women", imageUrl: "src/assets/nature_img2.jpg", color: "#dd5b5b"},
    {name: "Kids", imageUrl: "src/assets/nature_img3.jpg", color: "#5b9dd8"},
    {name: "Accessories", imageUrl: "src/assets/nature_img.jpg", color: "#1b8d91"},
    {name: "Jewelry", imageUrl: "src/assets/nature_img2.jpg", color: "#5bd85b"},
    {name: "Cars", imageUrl: "src/assets/nature_img3.jpg", color: "#d8d85b"},
    {name: "Bikes", imageUrl: "src/assets/nature_img.jpg", color: "#5bd8d8"},
    {name: "Sports", imageUrl: "src/assets/nature_img2.jpg", color: "#d85bd8"},
]

interface ItemGridProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;

}

const ItemGrid = ({className = "", ...props}: ItemGridProps) => {

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