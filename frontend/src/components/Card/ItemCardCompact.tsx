import {cn} from "../../lib/utils.ts";
import type {AuctionSummary} from "../../types/item.ts";
import IconButton from "../Button/IconButton.tsx";
import {LuHeart} from "react-icons/lu";
import {Link} from "react-router-dom";

export interface Item {
    id: number;
    title: string;
    currentBid: number;
    imageUrl: string
    endsAt: string;
}




interface ItemCardCompactProps {
    auction: AuctionSummary
    className?: string
    imgClassName?: string
}

const ItemCardCompact = ({className = "", imgClassName = "", auction}: ItemCardCompactProps) => {
    const baseStyles = "flex flex-col w-full aspect-square justify-center gap-2 shrink-0 cursor-pointer";
    return (
        <Link to={`/itemDetails/${auction.id}`} className={cn(baseStyles, className)}>
            <div className={cn("relative w-full h-full", imgClassName)}>
                <img src={auction.thumbnail} alt="Not Found" className="w-full h-full object-cover"/>
                <IconButton className="absolute top-3 left-3 bg-main" variant="outlined" icon={LuHeart}
                            iconClassName="text-brand">759</IconButton>
            </div>
            <div className="flex flex-col start-0 pt-1">
                <label className="text-muted font-mono tracking-widest text-[12px]">CURRENT BID</label>
                <label className="text-black font-medium text-xl text-start">{auction.currentBid}</label>
            </div>
        </Link>
    )
}



export default ItemCardCompact;