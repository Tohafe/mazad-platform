import type {ReactNode} from "react";
import {cn} from "../../lib/utils.ts";
import {cva, type VariantProps} from "class-variance-authority";

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children?: ReactNode,
    className?: string,
    iconPos?: "left" | "right"
}

const TextButton = ({
                        children = "Text Button",
                        className = "",
                        variant,
                        size,
                        underline,
                        ...props
                    }: TextButtonProps) => {
    return (
        <button type="button" className={cn(buttonVariants({
            variant,
            size,
            underline
        }), "inline-flex items-center gap-1 whitespace-nowrap", className)} {...props}>
            {children}
        </button>
    )
}
const baseStyles = "inline-flex items-center justify-center whitespace-nowrap bg-transparent text-black font-semibold hover:opacity-80 cursor-pointer";
const buttonVariants = cva(baseStyles, {
    variants: {
        variant: {
            primary: "text-primary",
            secondary: "text-secondary",
            danger: "text-error",
        },
        size: {
            sm: "text-sm px-1 py-1",
            md: "text-base px-2 py-2",
            lg: "text-lg px-3 py-3",
        },
        underline: {
            true: "underline underline-offset-4",
            false: ""
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
        underline: false
    }
})


export default TextButton