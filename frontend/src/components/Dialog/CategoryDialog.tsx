import {type DialogHTMLAttributes} from "react";
import {cn} from "../../lib/utils.ts";
import * as React from "react";
import CategoryGrid from "../Grid/CategoryGrid.tsx";
import IconButton from "../Button/IconButton.tsx";
import {MdClose} from "react-icons/md";
import {useCategories} from "../../hooks/useCategories.ts";

interface CategoryDialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
    classname?: string;
    dialogRef?: React.RefObject<HTMLDialogElement | null>;
    onClose: () => void;
}

const CategoryDialog = ({className = "", dialogRef, onClose, ...props}: CategoryDialogProps) => {
    const {data: categories = [], isLoading} = useCategories();

    if (isLoading) return <div>Loading...</div>;

    const baseStyles = "flex flex-col p-12 items-start justify-start w-fit h-fit bg-white m-auto backdrop:bg-black/75";
    return <dialog onClose={() => onClose()} ref={dialogRef} className={cn(baseStyles, className)} {...props} >
        <div className="flex flex-col items-center gap-4 w-full max-w-305">
            <div className="flex flex-row items-center justify-between gap-4 w-full">
                <h1 className="text-2xl font-semibold">Categories</h1>
                <IconButton onClick={() => onClose()} icon={MdClose} iconClassName="text-brand"/>
            </div>
            <CategoryGrid categories={categories} className="h-full"/>
        </div>
    </dialog>

}

export default CategoryDialog;