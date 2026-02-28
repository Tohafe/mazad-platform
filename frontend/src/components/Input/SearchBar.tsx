import {BiSearch} from "react-icons/bi";
import type {FormHTMLAttributes} from "react";
import {cn} from "../../lib/utils.ts";
import TextField from "./TextField.tsx";


interface SearchBarProps extends FormHTMLAttributes<HTMLFormElement> {
    className?: string
}

const SearchBar = ({className = ""}: SearchBarProps) => {
    return (
        <form className={cn("flex flex-row w-full max-w-150 grow items-center", className)}>
            <TextField icon={BiSearch} hint={"Search for brand, model, artist..."} className="w-full"/>
        </form>
    )
}

export default SearchBar