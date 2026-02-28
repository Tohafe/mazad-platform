import {cn} from "../lib/utils.ts";

interface DropdownProps {
    className?: string;
    open?: boolean
    children?: React.ReactNode
}

const Dropdown = ({className = "", open = true, children}: DropdownProps) => {
    if (!open) return null;
    const baseStyles = "overflow-y-auto absolute top-full left-0 z-50 max-h-60 w-full bg-main border-x-[0.5px] border-b-[0.5px] border-gray-200";
    return <div className={cn(baseStyles, className)}>
        {children}
    </div>
}



export default Dropdown;