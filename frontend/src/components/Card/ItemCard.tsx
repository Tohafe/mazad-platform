import {cn} from "../../lib/utils.ts";
import type {AuctionSummary} from "../../types/item.ts";
import {Link} from "react-router-dom";
import {useAuctionTimeLeft} from "../../lib/useAuctionTimeLeft.ts";


interface ItemCardProps {
    auction: AuctionSummary
    className?: string
}



const ItemCard = ({className = "", auction}: ItemCardProps) => {
    const baseStyles = "flex flex-col w-full aspect-4/5 justify-center gap-2 shrink-0 cursor-pointer";
    const timeLeftLabel = useAuctionTimeLeft(auction.status, auction.endsAt);
    const showCurrentBid = auction.currentBid !== 0
    const priceTitle = showCurrentBid ? "CURRENT BID": "STARTING PRICE";
    const effectivePrice = showCurrentBid ? auction.currentBid: auction.startingPrice;
    return (
        <Link to={`/auction/${auction.id}`} className={cn(baseStyles, className)}>
            <div className="relative w-full h-full xl:h-89">
                <img src={auction.thumbnail} alt="Not Found" className="w-full h-full object-cover"/>
            </div>
            <p className="text-black font-semibold leading-5 line-clamp-2 min-h-10">{auction.title}</p>
            <div className="flex flex-col">
                <span className="text-muted font-mono tracking-widest text-[12px]">{priceTitle}</span>
                <span className="text-black font-medium text-lg text-start">{effectivePrice}</span>
            </div>
            <label className="text-muted font-medium text-base font-noto">{timeLeftLabel}</label>
        </Link>
    )
}



export default ItemCard;