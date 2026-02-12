import {BiSearch} from "react-icons/bi";
import type {FormHTMLAttributes} from "react";
import {cn} from "../../lib/utils.ts";


interface SearchBarProps extends FormHTMLAttributes<HTMLFormElement> {
    className?: string
}

const SearchBar = ({className = ""}: SearchBarProps) => {
    return (
        <form className={cn("flex flex-row w-full max-w-150 grow items-center", className)}>
            <div className="flex w-full items-center bg-muted gap-4 px-6 h-12">
                <BiSearch className="text-brand text-3xl shrink-0"/>
                <input className="w-full bg-transparent outline-none" placeholder="Search for brand, model, artist..."/>
            </div>
        </form>
    )
}

export default SearchBar