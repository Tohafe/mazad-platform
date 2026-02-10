import {cn} from "../lib/utils.ts";

interface ImageSlideProps {
    className?: string
    url: string
}

const ImageSlide = ({className = "", url}: ImageSlideProps) => {
    const baseStyles = "w-full h-full object-cover cursor-pointer";
    return <img className={cn(baseStyles, className)} src={url} alt=""/>
}

export default ImageSlide