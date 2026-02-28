import ItemCard from "../Card/ItemCard.tsx";
import {type HTMLAttributes} from "react";
import {cn} from "../../lib/utils.ts";
import type { AuctionSummary } from "../../types/item.ts";


interface ItemGridProps extends HTMLAttributes<HTMLDivElement> {
    noTitle?: boolean;
    className?: string;
    auctions: AuctionSummary[]
}

const ItemGrid = ({auctions, noTitle = false, className = "", ...props}: ItemGridProps) => {
    const baseStyles = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-6";
    return (
        <div className={cn(baseStyles, className)} {...props}>
            {auctions.map((item) => <ItemCard key={item.id} className="pt-2"  auction={item}/>)}
        </div>
    );
};


export default ItemGrid