import {type DialogHTMLAttributes} from "react";
import {cn} from "../../lib/utils.ts";
import * as React from "react";
import CategoryGrid from "../Grid/CategoryGrid.tsx";
import IconButton from "../Button/IconButton.tsx";
import {MdClose} from "react-icons/md";
import {useCategories} from "../../hooks/useCategories.ts";
import type {Category} from "../../types/category.ts";
import CategoryCard from "../Card/CategoryCard.tsx";

interface CategoryDialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
    classname?: string;
    dialogRef?: React.RefObject<HTMLDialogElement | null>;
    onClose: () => void;
}

const CategoryDialog = ({className = "", dialogRef, onClose, ...props}: CategoryDialogProps) => {
    const {data: categories = [], isLoading} = useCategories();

    const handleCategoryClick = (_: Category) => {
        onClose();
    }

    const baseStyles = "flex flex-col p-4 md:p-12 items-start justify-start w-fit h-fit bg-white m-auto backdrop:bg-black/75";
    return <dialog onClose={() => onClose()} ref={dialogRef} className={cn(baseStyles, className)} {...props} >
        <div className="flex flex-col items-center gap-4 w-full max-w-305">
            <div className="flex flex-row items-center justify-between gap-4 w-full">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <IconButton onClick={() => onClose()} icon={MdClose} iconClassName="text-brand"/>
            </div>

            {isLoading ? <div>Loading...</div> : <CategoryGrid onCategoryClick={handleCategoryClick} className="h-full">
                {categories && categories.map((category) => <CategoryCard
                    titleClassName="text-xs"
                    imgClassName="w-8 h-8"
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    category={category}/>)}
            </CategoryGrid>}

        </div>
    </dialog>

}

export default CategoryDialog;