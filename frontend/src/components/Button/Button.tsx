import type {ButtonHTMLAttributes, ReactNode} from "react";
import {cn} from "../../lib/utils.ts";
import {cva, type VariantProps} from "class-variance-authority";
import type {IconType} from "react-icons";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: ReactNode,
    className?: string,
    icon?: IconType,
    iconPos?: "left" | "right",
    iconClassName?: string
}

const Button = ({
                    children = "Button",
                    className = "", variant,
                    size,
                    icon: Icon,
                    iconPos = "left",
                    iconClassName = "",
                    ...props
                }: ButtonProps) => {

    return (
        <button type="button" className={cn(buttonVariants({variant, size}), className)} {...props}>
            <div className={cn(`flex items-center gap-2 ${iconPos === "right" ? "flex-row-reverse" : "flex-row"}`)}>
                {Icon && <Icon className={cn("shrink-0", iconClassName)}/>}
                {children}
            </div>
        </button>
    )
}


const baseStyles = "inline-flex items-center gap-2 justify-center whitespace-nowrap hover:opacity-80 font-semibold cursor-pointer"
const buttonVariants = cva(baseStyles, {
    variants: {
        variant: {
            primary: "bg-brand text-onbrand",
            secondary: "bg-main text-onbackground border border-border",
            danger: "bg-main text-error border border-error"
        },
        size: {
            sm: "text-sm px-3 h-10",
            md: "text-base px-4 h-12",
            lg: "text-lg px-8 h-14"
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
})

export default Button