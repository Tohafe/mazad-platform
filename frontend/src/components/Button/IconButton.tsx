import type {ReactNode} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "../../lib/utils.ts";
import type {IconType} from "react-icons";


interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    icon: IconType
    iconPos?: "left" | "right",
    iconClassName?: string,
    className?: string,
    children?: ReactNode,

}

const IconButton = ({children, className = "", variant, icon: Icon, iconPos = "left", iconClassName, size, ...props}: IconButtonProps) => {
    return (
        <button type="button"  className={cn(buttonVariants({variant, size}), className)} {...props}>
            <div className={cn(buttonBaseStyles, `flex items-center gap-2 ${iconPos === "right" ? "flex-row-reverse" : "flex-row"}`)}>
                <Icon className={cn(iconVariants({size}), iconClassName, "shrink-0")}/>
                {children}
            </div>
        </button>
    )
}

const buttonBaseStyles = "flex justify-center items-center gap-2 hover:opacity-80 cursor-pointer"
const buttonVariants = cva(buttonBaseStyles, {
    variants: {
        variant: {
            ghost: "bg-transparent text-primary font-semibold",
            outlined: "text-secondary font-normal border border-border rounded-full"
        },
        size: {
            sm: "text-sm px-2 h-6",
            md: "text-base px-3 h-8",
            lg: "text-lg px-5 h-10",
            xlg: "text-lg px-6 h-12"
        }
    },
    defaultVariants: {
        variant: "ghost",
        size: "md"
    }
})

const iconVariants = cva("", {
    variants: {
        size: {
            sm: "size-4",
            md: "size-6 aspect-square",
            lg: "size-7",
            xlg: "size-7"
        }
    },
    defaultVariants: {
        size: "md"
    }
})

export default IconButton