import ItemCard from "../Card/ItemCard.tsx";
import {type HTMLAttributes, type ReactNode} from "react";
import {cn} from "../../lib/utils.ts";
import type { AuctionSummary } from "../../types/item.ts";
import ItemCardCompact from "../Card/ItemCardCompact.tsx";


interface ItemGridProps extends HTMLAttributes<HTMLDivElement> {
    compact?: boolean;
    className?: string;
    auctions?: AuctionSummary[];
    children?: ReactNode
}

const ItemGrid = ({auctions, compact = false, className = "", children, ...props}: ItemGridProps) => {
    const baseStyles = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-6";
    const Item = compact ? ItemCardCompact : ItemCard;
    if (auctions?.length === 0) return <div className="w-full flex justify-center">No auctions found</div>;
    return (
        <div className={cn(baseStyles, className)} {...props}>
            {auctions && auctions.map((item) => <Item key={item.id} className="pt-2" auction={item}/>)}
            {!auctions && children}
        </div>
    );
};


export default ItemGrid