import logo from "../assets/logo.png"
import TextButton from "../components/Button/TextButton.tsx";
import {MdKeyboardArrowDown, MdKeyboardArrowLeft, MdLanguage} from "react-icons/md";
import SearchBar from "../components/Input/SearchBar.tsx";
import IconButton from "../components/Button/IconButton.tsx";
import {LuHeart} from "react-icons/lu";
import Button from "../components/Button/Button.tsx";
import {BiSearch} from "react-icons/bi";
import {useEffect, useRef, useState} from "react";
import {cn} from "../lib/utils.ts";
import CategoryDialog from "../components/Dialog/CategoryDialog.tsx";


interface HeaderSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const HeaderSection = ({className = "", ...props}: HeaderSectionProps) => {
    const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() =>{
        const ref = dialogRef.current;
        if (!ref) return;
        ref.showModal();
        // return () => ref.close();
    }, [dialogOpen])

    const baseStyles = "flex flex-row items-center justify-between bg-white gap-6 py-3";

    return <>
        {dialogOpen && <CategoryDialog onClose={() => setDialogOpen(false)} dialogRef={dialogRef} className="items-center"/>}

        <div className={cn(baseStyles, className, )} {...props}>
            <div className={`flex gap-1 items-center shrink-0 ${showFullWidthSearch ? "hidden" : "flex"}`}>
                <img src={logo} className="h-14" alt="logo"/>
                <h1 className="hidden lg:block text-2xl font-bold text-brand">Mazad</h1>
                <IconButton onClick={() => setDialogOpen(true)} size="sm" icon={MdKeyboardArrowDown}
                            iconClassName="text-brand">Categories</IconButton>
            </div>

            {showFullWidthSearch && <IconButton onClick={() => setShowFullWidthSearch(false)} icon={MdKeyboardArrowLeft}
                                                iconClassName="text-brand" size="md"/>}
            <SearchBar className={`${showFullWidthSearch ? "flex" : "hidden md:flex"}`}/>
            <div className={`flex-row items-center gap-1 ${showFullWidthSearch ? "hidden" : "flex"}`}>
                <IconButton onClick={() => setShowFullWidthSearch(true)} icon={BiSearch} iconClassName="text-brand"
                            size="md" className="flex md:hidden"/>
                <TextButton className="hidden md:flex" size="sm">How it works?</TextButton>
                <TextButton className="hidden md:flex" size="sm">Help</TextButton>
                <IconButton size="md" icon={LuHeart} iconClassName="text-brand"></IconButton>
                <IconButton className="hidden sm:flex" size="md" icon={MdLanguage}
                            iconClassName="text-brand">EN</IconButton>
                <Button className="flex ms-3">Sign in</Button>
            </div>

        </div>
    </>
}


export default HeaderSection