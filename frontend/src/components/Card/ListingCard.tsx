import type {AuctionSummary} from "../../types/item.ts";
import {cn} from "../../lib/utils.ts";
import IconButton from "../Button/IconButton.tsx";
import Button from "../Button/Button.tsx";
import type {AuctionStatus} from "../../types/item";
import {MdCancel} from "react-icons/md";
import {useAuctionTimeLeft} from "../../lib/useAuctionTimeLeft.ts";
import {Link} from "react-router-dom";


function mapStatus(status: AuctionStatus): String {
    if (status === "ACTIVE") return "Live";
    if (status === "SOLD") return "Sold";
    if (status === "EXPIRED") return "Expired";
    if (status === "CANCELLED") return "Cancelled";
    return "";
}

interface ListingCardProps {
    auction: AuctionSummary
    handleCancelClick?: (auction: AuctionSummary) => void
    className?: string
    imgClassName?: string
}


const ListingCard = ({
                         className = "",
                         imgClassName = "",
                         handleCancelClick,
                         auction
                     }: ListingCardProps) => {
    const baseStyles = "flex flex-col w-full aspect-square justify-center gap-2 shrink-0 cursor-pointer";
    const timeLeftLabel = useAuctionTimeLeft(auction.status, auction.endsAt);
    const showCurrentBid = auction.currentBid !== 0
    const priceTitle = showCurrentBid ? "CURRENT BID": "STARTING PRICE";
    const effectivePrice = showCurrentBid ? auction.currentBid: auction.startingPrice;
    return (
        <Link to={`/auction/${auction.id}`} className={cn(baseStyles, className)}>

            <div className={cn("relative w-full h-full", imgClassName)}>
                <img src={auction.thumbnail} alt="Not Found" className="w-full h-full object-cover"/>
                <IconButton className="absolute top-3 left-3 bg-main" variant="outlined"
                            iconClassName="text-brand">{mapStatus(auction.status)}</IconButton>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col pt-1">
                    <label className="text-muted font-mono tracking-widest text-[12px]">{priceTitle}</label>
                    <label className="text-black font-medium text-xl text-start">{effectivePrice}</label>
                </div>
                {auction.status === "ACTIVE" && handleCancelClick && auction.currentBid === 0 &&
                    <Button size="sm" onMouseDown={() => handleCancelClick(auction)} variant="danger" icon={MdCancel}
                            iconClassName="">Cancel</Button>}
            </div>
            <label className="text-muted font-medium text-sm font-noto">{timeLeftLabel}</label>

        </Link>
    )
}

export default ListingCard;