import {BiSearch} from "react-icons/bi";
import {cn} from "../lib/utils.ts";
import type {HTMLAttributes} from "react";

interface HistoryItemProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
}

const HistoryItem = ({className = "", children, ...props}: HistoryItemProps) => {
    const baseStyles = "flex gap-4 items-center font-semibold text-base text-secondary px-5 py-4 hover:bg-gray-100 cursor-pointer";
    return <div className={cn(baseStyles, className)} {...props}>
        <BiSearch className="shrink-0" size={24} color={"gray"}/>
        {children}
    </div>
}

export default HistoryItem;