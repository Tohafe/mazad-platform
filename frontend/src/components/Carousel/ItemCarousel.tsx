import {Swiper, type SwiperRef, SwiperSlide} from 'swiper/react';
import ItemCard from "../Card/ItemCard.tsx";
import IconButton from "../Button/IconButton.tsx";
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import {useRef, useState} from "react";
import {cn} from "../../lib/utils.ts";

import { Swiper as SwiperClass } from 'swiper';
import type {AuctionSummary} from "../../types/item.ts";

interface ItemCarouselProps {
    carouselTitle?: string;
    className?: string
    auctions: AuctionSummary[]
}

const ItemCarousel = ({carouselTitle = "", className = "", auctions}: ItemCarouselProps) => {
    const swiperRef = useRef<SwiperRef>(null)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [canScrollLeft, setCanScrollLeft] = useState(false)

    const updateState = (swiper: SwiperClass) => {
        setCanScrollRight(swiper.isBeginning || !swiper.isEnd);
        setCanScrollLeft(swiper.isEnd || !swiper.isBeginning);
    }

    return (
        <div className={cn("relative flex flex-col w-full gap-4 max-w-7xl", className)}>
            <h2 className="text-base text-black font-semibold">{carouselTitle}</h2>
            <Swiper
                className="w-full overflow-visible!"
                ref={swiperRef}
                slidesPerView={2.3}
                spaceBetween={16}
                slidesPerGroup={1}
                onSwiper={updateState}
                onSlideChange={updateState}
                breakpoints={{
                    768: {slidesPerView: 3.2, slidesPerGroup: 3, spaceBetween: 16}, // tablet
                    1024: {slidesPerView: 4.0, slidesPerGroup: 4, spaceBetween: 24}
                }}
            >
                {auctions.map(auction => (
                    <SwiperSlide className="" key={auction.id}>
                        <ItemCard auction={auction}/>
                    </SwiperSlide>
                ))}
                {canScrollLeft && <IconButton className="absolute left-0 top-1/3 z-10"
                                              onClick={() => swiperRef.current?.swiper.slidePrev()}
                                              iconClassName="text-black bg-white rounded-full p-2 w-10 h-10 shadow-lg hover:shadow-lg"
                                              icon={MdKeyboardArrowLeft}></IconButton>}

                {canScrollRight && <IconButton className="absolute right-0 top-1/3 z-10"
                                               onClick={() => swiperRef.current?.swiper.slideNext()}
                                               iconClassName="text-black bg-white rounded-full p-2 w-10 h-10 shadow-lg hover:shadow-lg"
                                               icon={MdKeyboardArrowRight}></IconButton>}

            </Swiper>

        </div>
    );
};

export default ItemCarousel