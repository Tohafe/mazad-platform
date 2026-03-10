import type {ButtonHTMLAttributes, ReactNode} from "react";
import {cn} from "../../lib/utils.ts";
import {cva, type VariantProps} from "class-variance-authority";
import type {IconType} from "react-icons";
import {useLocation, useNavigate} from "react-router-dom";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: ReactNode,
    className?: string,
    icon?: IconType,
    iconPos?: "left" | "right",
    iconClassName?: string,
    link?: string,
    from?: Location,
}

const Button = ({
                    children = "Button",
                    className = "", variant,
                    size,
                    icon: Icon,
                    iconPos = "left",
                    iconClassName = "",
                    link,
                    ...props
                }: ButtonProps) => {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <button onClick={() => navigate(link ?? "", { state: { from: location } })} type="button"
                className={cn(buttonVariants({variant, size}), className)} {...props}>
            <div className={cn(`flex items-center gap-2 ${iconPos === "right" ? "flex-row-reverse" : "flex-row"}`)}>
                {Icon && <Icon className={cn("shrink-0", iconClassName)}/>}
                {children}
            </div>
        </button>
    )
}


const baseStyles = "inline-flex items-center gap-2 justify-center whitespace-nowrap hover:opacity-80 font-medium cursor-pointer"
const buttonVariants = cva(baseStyles, {
    variants: {
        variant: {
            primary: "bg-brand text-onbrand",
            secondary: "bg-main text-onbackground border border-border",
            danger: "bg-main text-error border border-error"
        },
        size: {
            sm: "text-xs px-3 h-10",
            md: "text-[15px] px-5 h-13",
            lg: "text-base px-8 h-14"
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
})

export default Button