import {cn} from "../../lib/utils.ts";

export interface Item {
    id: number;
    title: string;
    currentBid: number;
    imageUrl: string
    endsAt: string;
}




interface ItemCardCompactProps {
    item: Item
    className?: string
    imgClassName?: string
}

import IconButton from "../Button/IconButton.tsx";
import {LuHeart} from "react-icons/lu";

const ItemCardCompact = ({className = "", imgClassName = "", item: Item}: ItemCardCompactProps) => {
    const baseStyles = "flex flex-col w-full aspect-square justify-center gap-2 shrink-0 cursor-pointer";
    return (
        <div className={cn(baseStyles, className)}>
            <div className={cn("relative w-full h-full", imgClassName)}>
                <img src="src/assets/item_photo.jpg" alt="Not Found" className="w-full h-full object-cover"/>
                <IconButton className="absolute top-3 left-3 bg-main" variant="outlined" icon={LuHeart}
                            iconClassName="text-brand">759</IconButton>
            </div>
            <div className="flex flex-col start-0 pt-1">
                <label className="text-muted font-mono tracking-widest text-[12px]">CURRENT BID</label>
                <label className="text-black font-medium text-xl text-start">{Item.currentBid}</label>
            </div>
        </div>
    )
}



export default ItemCardCompact;