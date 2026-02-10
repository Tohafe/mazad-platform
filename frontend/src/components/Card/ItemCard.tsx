import {cn} from "../../lib/utils.ts";

export interface Item {
    id: number;
    title: string;
    currentBid: number;
    imageUrl: string
    endsAt: string;
}




interface ItemCardProps {
    item: Item
    className?: string
}

import IconButton from "../Button/IconButton.tsx";
import {LuHeart} from "react-icons/lu";

const ItemCard = ({className = "", item: Item}: ItemCardProps) => {
    const baseStyles = "flex flex-col w-full aspect-4/5 justify-center gap-2 shrink-0 cursor-pointer";
    return (
        <div className={cn(baseStyles, className)}>
            <div className="relative w-full h-full xl:h-89">
                <img src="src/assets/item_photo.jpg" alt="Not Found" className="w-full h-full object-cover"/>
                <IconButton className="absolute top-3 left-3 bg-main" variant="outlined" icon={LuHeart}
                            iconClassName="text-brand">759</IconButton>
            </div>
            <p className="text-black font-semibold leading-6 line-clamp-2 min-h-12">{Item.title}</p>
            <div className="flex flex-col start-0 pt-1">
                <label className="text-muted font-mono tracking-widest text-[12px]">CURRENT BID</label>
                <label className="text-black font-medium text-xl text-start">{Item.currentBid}</label>
            </div>
            <label className="text-muted font-medium text-base font-noto">{Item.endsAt}</label>
        </div>
    )
}



export default ItemCard;