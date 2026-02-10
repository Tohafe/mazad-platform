import type {ReactNode} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "../../lib/utils.ts";
import {LiaFireAltSolid} from "react-icons/lia";
import {BiSearch} from "react-icons/bi";
import {
    LuWatch, LuPalette, LuGem, LuCar, LuPackage, LuShirt,
    LuFootprints, LuBookOpen, LuCoins, LuGlassWater,
    LuPenTool, LuCamera, LuShoppingBag, LuLayers, LuTrophy, LuSmartphone
} from "react-icons/lu";


const icons = {
    LiaFireAltSolid, BiSearch, LuWatch, LuPalette, LuGem, LuCar, LuPackage, LuShirt,
    LuFootprints, LuBookOpen, LuCoins, LuGlassWater,
    LuPenTool, LuCamera, LuShoppingBag, LuLayers, LuTrophy, LuSmartphone
};
export type IconKey = keyof typeof icons

interface TabProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof tabVariants> {
    children?: ReactNode,
    iconKey: IconKey,

}

const Tab = ({children = "Tab", iconKey, variant, size, ...props}: TabProps) => {
    const Icon = icons[iconKey];
    return (
        <a className={cn(tabVariants({variant, size}),)} {...props}>
            <Icon className={cn(iconVariants({size}))}/>
            <span>{children}</span>
        </a>
    )
}


const baseStyles = "flex flex-col h-full items-center font-semibold cursor-pointer"
const tabVariants = cva(baseStyles, {
    variants: {
        variant: {
            selected: "bg-main text-brand ",
            unselected: "bg-main text-secondary border-transparent hover:border-b-4 hover:border-border",
        },
        size: {
            sm: "text-xs px-3 border-b-3 pt-1",
            md: "text-sm px-5 border-b-4 pt-3",
            lg: "text-lg px-6 border-b-5 pt-5"
        }
    },
    defaultVariants: {
        variant: "selected",
        size: "md"
    }
})

const iconVariants = cva("", {
    variants: {
        size: {
            sm: "size-6",
            md: "size-7.5",
            lg: "size-8.5"
        }
    },
    defaultVariants: {
        size: "md"
    }
})

export default Tab