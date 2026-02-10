import ImageSlide from "../ImageSlide.tsx";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import {cn} from "../../lib/utils.ts";
import IconButton from "../Button/IconButton.tsx";
import {MdKeyboardArrowRight} from "react-icons/md";
import {useState} from "react";
import {items} from "../Grid/ItemGrid.tsx";
import ItemCardCompact from "../Card/ItemCardCompact.tsx";

interface Slide {
    image: string,
    title: string,
    subtitle: string,
    description: string,
}

export const heroSlides:Slide[] = [
    {
        image: "src/assets/nature_img.jpg",
        title: "World Money Fair",
        subtitle: "Collection",
        description:
            "Historic coins and rare banknotes from sellers at the World Money Fair in Berlin.",
    },
    {
        image: "src/assets/nature_img2.jpg",
        title: "Ancient Coins Expo",
        subtitle: "Limited Edition",
        description:
            "Discover rare ancient coins from around the world, carefully curated for collectors.",
    },
    {
        image: "src/assets/nature_img3.jpg",
        title: "Modern Currency Showcase",
        subtitle: "Exclusive Notes",
        description:
            "Explore colorful banknotes and modern collectible coins from international mints.",
    },
    {
        image: "src/assets/nature_img2.jpg",
        title: "Gold & Silver Treasures",
        subtitle: "Collector's Choice",
        description:
            "High-value gold and silver coins from historical collections available for enthusiasts.",
    },
    {
        image: "src/assets/nature_img3.jpg",
        title: "Rare Coin Auction",
        subtitle: "Bid Now",
        description:
            "Join live auctions and grab rare coins before they disappear into private collections.",
    },
    {
        image: "src/assets/nature_img.jpg",
        title: "Historical Banknotes",
        subtitle: "Classic Series",
        description:
            "Explore historical banknotes from around the world, perfect for any collector.",
    },
];


const HeroCarousel = ({className = ""}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <div className={cn("flex flex-col w-full h-full", className)}>
            <div className={"flex flex-row gap-4 w-full h-76"}>

                <InfoSlider className="flex-1" data={heroSlides[currentSlide]}/>

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
                    {heroSlides.map((slide, index) =>
                        <SwiperSlide key={index} className="">
                            <div className="flex flex-row w-full h-full">
                                <ImageSlide className="" url={slide.image}/>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>

            <ItemsSlider className="w-full h-full mt-12"/>

        </div>
    )
}


const InfoSlider = ({className = "", data: Slide}) => {
    return <div className={cn("relative flex justify-start flex-col gap-4 py-4", className)}>
        <h1 className="text-brand font-semibold font-serif text-3xl md:text-4xl lg:text-5xl line-clamp-2">{Slide.title}</h1>
        <h1 className="text-black font-semibold text-3xl md:text-4xl lg:text-5xl">{Slide.subtitle}</h1>
        <p className="text-secondary font-medium  text-sm md:text-base line-clamp-3">{Slide.description}</p>
        <div className="absolute bottom-0 flex flex-row w-full items-center">
            <div className="hero-pagination flex gap-3 w-full h-2"></div>
            <IconButton className="hero-pagination-next" icon={MdKeyboardArrowRight} iconClassName="text-brand"/>
        </div>

    </div>
}

const ItemsSlider = ({className = ""}) => {
    return <Swiper
        modules={[Autoplay]}
        className={cn(className)}
        slidesPerView={2}
        slidesPerGroup={2}
        spaceBetween={8}
        loop={true}
        autoplay={{delay: 3000}}
        breakpoints={{
            768: {slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 16},
            1024: {slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 24}
        }}
    >
        {items.map((item, i) => (
            <SwiperSlide key={i}>
                <ItemCardCompact item={item}/>
            </SwiperSlide>
        ))}

    </Swiper>
}



export default HeroCarousel