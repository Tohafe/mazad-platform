import {cn} from "../../lib/utils.ts";

export interface Item {
    id: number;
    title: string;
    currentBid: number;
    imageUrl: string
    endsAt: string;
}




interface ItemCardProps {
    auction: AuctionSummary
    className?: string
}

import IconButton from "../Button/IconButton.tsx";
import {LuHeart} from "react-icons/lu";
import type {AuctionSummary} from "../../types/item.ts";

const ItemCard = ({className = "", auction}: ItemCardProps) => {
    const baseStyles = "flex flex-col w-full aspect-4/5 justify-center gap-2 shrink-0 cursor-pointer";
    return (
        <div className={cn(baseStyles, className)}>
            <div className="relative w-full h-full xl:h-89">
                <img src={auction.thumbnail} alt="Not Found" className="w-full h-full object-cover"/>
                <IconButton className="absolute top-3 left-3 bg-main" variant="outlined" icon={LuHeart}
                            iconClassName="text-brand">759</IconButton>
            </div>
            <p className="text-black font-semibold leading-5 line-clamp-2 min-h-10">{auction.title}</p>
            <div className="flex flex-col start-0">
                <label className="text-muted font-mono tracking-widest text-[12px]">CURRENT BID</label>
                <label className="text-black font-medium text-lg text-start">${auction.currentBid}</label>
            </div>
            <label className="text-muted font-medium text-base font-noto">{auction.endsAt}</label>
        </div>
    )
}



export default ItemCard;