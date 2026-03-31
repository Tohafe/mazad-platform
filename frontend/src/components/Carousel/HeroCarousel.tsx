import ImageSlide from "../ImageSlide.tsx";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import {cn} from "../../lib/utils.ts";
import IconButton from "../Button/IconButton.tsx";
import {MdKeyboardArrowRight} from "react-icons/md";
import {useState} from "react";
import ItemCardCompact from "../Card/ItemCardCompact.tsx";
import {useCategoriesAuctions} from "../../hooks/useAuctions.ts";
import type {AuctionSummary} from "../../types/item.ts";
import type {Category} from "../../types/category.ts";
import {Link} from "react-router-dom";

const HeroCarousel = ({className = ""}) => {
    const {data = [], isLoading} = useCategoriesAuctions(6, 4);
    const [currentSlide, setCurrentSlide] = useState(0);

    if (isLoading) return <div>Loading...</div>;


    return (
        <div className={cn("relative flex flex-col w-full h-full", className)}>
            {data[currentSlide].items.length > 0 ?
                <div className="absolute top-0 bottom-30 left-1/2 -ml-[50vw] w-screen bg-gray-50"></div> :
                <div className="absolute top-0 bottom-0 left-1/2 -ml-[50vw] w-screen bg-gray-50"></div>
            }
            <div className={"flex flex-row gap-4 w-full h-76"}>

                {data.length > 0 && <InfoSlider className="flex-1" data={data[currentSlide].category}/>}

                <Swiper
                    className="w-full h-full flex-1"
                    modules={[Autoplay, Pagination, Navigation]}
                    direction="vertical"
                    slidesPerView={1}
                    spaceBetween={0}
                    loop={true}
                    autoplay={{delay: 4000}}
                    pagination={{
                        clickable: true,
                        el: ".hero-pagination"
                    }}
                    navigation={{nextEl: ".hero-pagination-next"}}
                    onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                >
                    {data.map((slide, index) =>
                        <SwiperSlide key={index} className="">
                            <Link to={`/c/${slide.category.id}-${slide.category.slug}`}
                                  className="flex flex-row w-full h-full">
                                <ImageSlide className="" url={slide.category.imageUrl}/>
                            </Link>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>

            {data.length > 0 &&
                <ItemsSlider key={currentSlide} auctions={data[currentSlide].items} className="w-full h-full mt-12"/>}

        </div>
    )
}


const InfoSlider = ({className = "", data: Slide}: { className: string, data: Category }) => {
    return <div className={cn("relative flex justify-start flex-col gap-4 py-4", className)}>
        <h1 className="text-brand font-semibold font-serif text-3xl md:text-4xl lg:text-5xl line-clamp-2">{Slide.name}</h1>
        <h1 className="text-black font-semibold text-3xl md:text-4xl lg:text-5xl">Collection</h1>
        <p className="text-secondary font-medium  text-sm md:text-base line-clamp-3">{Slide.description}</p>
        <div className="absolute bottom-0 flex flex-row w-full items-center">
            <div className="hero-pagination flex gap-3 w-full h-2"></div>
            <IconButton className="hero-pagination-next" icon={MdKeyboardArrowRight} iconClassName="text-brand"/>
        </div>

    </div>
}

const ItemsSlider = ({className = "", auctions}: { className: string, auctions: AuctionSummary[] }) => {

    return <Swiper
        modules={[Autoplay]}
        className={cn(className)}
        slidesPerView={2}
        slidesPerGroup={2}
        spaceBetween={8}
        loop={false}
        autoplay={{delay: 3000}}
        breakpoints={{
            768: {slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 16},
            1024: {slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 24}
        }}
    >
        {auctions.map((item, i) => (
            <SwiperSlide key={i}>
                <ItemCardCompact auction={item}/>
            </SwiperSlide>
        ))}

    </Swiper>
}


export default HeroCarousel