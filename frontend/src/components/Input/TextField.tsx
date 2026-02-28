import {cn} from "../../lib/utils.ts";
import type {IconType} from "react-icons";


interface TextFieldProps {
    className?: string;
    iconClassName?: string;
    hint?: string;
    icon?: IconType
}
const TextField = ({className = "", iconClassName = "", hint = "", icon: Icon}: TextFieldProps) => {
    const baseStyles = "flex w-full items-center bg-muted gap-4 px-6 py-4"
    return <div className={cn(baseStyles, className)}>
        {Icon && <Icon className={cn("text-brand text-3xl shrink-0", iconClassName)} />}
        <input className="w-full bg-transparent outline-none" placeholder={hint}/>
    </div>
}


export default TextField;