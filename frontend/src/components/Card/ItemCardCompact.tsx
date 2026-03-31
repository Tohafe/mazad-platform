import {cn} from "../../lib/utils.ts";
import type {AuctionSummary} from "../../types/item.ts";
import {Link} from "react-router-dom";
import {formatPrice} from "../../utils/currency.ts";
import PLACE_HOLDER from "../../assets/place_holder.svg";

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
    const showCurrentBid = auction.currentBid !== 0
    const priceTitle = showCurrentBid ? "CURRENT BID": "STARTING PRICE";
    const effectivePrice = showCurrentBid ? auction.currentBid: auction.startingPrice;
    return (
        <Link to={`/auction/${auction.id}`} className={cn(baseStyles, className)}>
            <div className={cn("relative w-full h-full", imgClassName)}>
                <img
                    src={auction.thumbnail}
                    alt="Not Found"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = PLACE_HOLDER;
                    }}
                />
            </div>
            <div className="flex flex-col pt-1">
                <label className="text-muted font-mono tracking-widest text-[12px]">{priceTitle}</label>
                <label className="text-black font-medium text-xl text-start">{formatPrice(effectivePrice)}</label>
            </div>
        </Link>
    )
}



export default ItemCardCompact;