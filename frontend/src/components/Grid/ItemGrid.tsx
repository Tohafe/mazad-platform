import {type Item} from "../Card/ItemCard.tsx";
import type {HTMLAttributes} from "react";
import {cn} from "../../lib/utils.ts";
import ItemCardCompact from "../Card/ItemCardCompact.tsx";


export const items: Item[] = [
    {
        id: 1,
        title: "Rolex - Sea-Dweller 4000ft/1220m - No reserve price - 16600 - Men - 1998",
        currentBid: 113,
        imageUrl: "https://i.pinimg.com/originals/88/ef/5a/88ef5a1d7984e5bde3d894fab8583828.jpg",
        endsAt: "1 day left",
    },
    {
        id: 2,
        title: "Omega Speedmaster Professional Moonwatch - Men - 2005",
        currentBid: 245,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        endsAt: "3 days left",
    },
    {
        id: 3,
        title: "TAG Heuer Carrera Automatic Chronograph - Men - 2012",
        currentBid: 310,
        imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa",
        endsAt: "12 hours left",
    },
    {
        id: 4,
        title: "Seiko Prospex Diver Automatic Limited Edition",
        currentBid: 89,
        imageUrl: "https://images.unsplash.com/photo-1609587312208-cea54be969e7",
        endsAt: "2 days left",
    },
    {
        id: 5,
        title: "Patek Philippe Calatrava Classic Dress Watch",
        currentBid: 1200,
        imageUrl: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a",
        endsAt: "5 days left",
    },
    {
        id: 6,
        title: "Breitling Navitimer Automatic Chronograph",
        currentBid: 540,
        imageUrl: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
        endsAt: "18 hours left",
    },
    {
        id: 7,
        title: "Tissot PRX Powermatic 80 Stainless Steel",
        currentBid: 75,
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
        endsAt: "6 hours left",
    },
    {
        id: 8,
        title: "Audemars Piguet Royal Oak Offshore",
        currentBid: 2300,
        imageUrl: "https://images.unsplash.com/photo-1617042375876-a13e36732a04",
        endsAt: "4 days left",
    },
    {
        id: 9,
        title: "Cartier Santos Automatic Stainless Steel - Men",
        currentBid: 670,
        imageUrl: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e",
        endsAt: "9 hours left",
    },
    {
        id: 10,
        title: "Grand Seiko Heritage Spring Drive",
        currentBid: 980,
        imageUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6",
        endsAt: "2 days left",
    },
    {
        id: 11,
        title: "Longines Master Collection Moonphase",
        currentBid: 340,
        imageUrl: "https://images.unsplash.com/photo-1622434641406-a158123450f9",
        endsAt: "1 day left",
    },
    {
        id: 12,
        title: "Hamilton Khaki Field Automatic 42mm",
        currentBid: 120,
        imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6",
        endsAt: "7 hours left",
    },
    {
        id: 13,
        title: "IWC Big Pilot Automatic Heritage",
        currentBid: 1500,
        imageUrl: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2",
        endsAt: "3 days left",
    },
    {
        id: 14,
        title: "Citizen Promaster Diver Eco-Drive djasndkjnaskjdn kjasndk jasnkdj naskjd ",
        currentBid: 60,
        imageUrl: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5",
        endsAt: "5 hours left",
    },
    {
        id: 15,
        title: "Oris Aquis Date Automatic Diver",
        currentBid: 220,
        imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
        endsAt: "11 hours left",
    },
    {
        id: 16,
        title: "Zenith El Primero Chronomaster",
        currentBid: 890,
        imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
        endsAt: "4 days left",
    },
    {
        id: 17,
        title: "Panerai Luminor Marina Automatic",
        currentBid: 1300,
        imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b",
        endsAt: "2 days left",
    },
    {
        id: 18,
        title: "Tudor Black Bay Fifty-Eight",
        currentBid: 450,
        imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
        endsAt: "20 hours left",
    },
];

interface ItemGridProps extends HTMLAttributes<HTMLDivElement>{
    noTitle?: boolean;
    className?: string;
}

const ItemGrid = ({noTitle = false, className = "", ...props}: ItemGridProps) => {

    const baseStyles = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xl:gap-6";

  return (
    <div className={cn(baseStyles, className)} {...props}>
        {items.map((item) => <ItemCardCompact className="pt-2" imgClassName="xl:h-88" item={item}/> )}
    </div>
  );
};



export default ItemGrid