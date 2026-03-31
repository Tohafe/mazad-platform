import logo from "../assets/logo.png"
import {MdKeyboardArrowDown, MdKeyboardArrowLeft} from "react-icons/md";
import SearchBar from "../components/Input/SearchBar.tsx";
import IconButton from "../components/Button/IconButton.tsx";
import Button from "../components/Button/Button.tsx";
import {BiSearch} from "react-icons/bi";
import {useEffect, useRef, useState} from "react";
import {cn} from "../lib/utils.ts";
import CategoryDialog from "../components/Dialog/CategoryDialog.tsx";
import {NotificationBell} from '../components/Notification/NotificationBell.tsx';
import {useAuth} from "../context/AuthProvider.tsx";
import UserMenu from "../components/UserMenu.tsx";
import {Link} from "react-router-dom";
import Balance from "../components/Balance.tsx";
import TextButton from "../components/Button/TextButton.tsx";


interface HeaderSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const HeaderSection = ({className = "", ...props}: HeaderSectionProps) => {
    const [showFullWidthSearch, setShowFullWidthSearch] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const {isAuthenticated, user} = useAuth();

    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        const ref = dialogRef.current;
        if (!ref) return;
        if (dialogOpen) ref.showModal();
        else ref.close();
    }, [dialogOpen])

    const baseStyles = "flex flex-row items-center justify-between bg-white gap-6 py-3";

    return <>
        {dialogOpen &&
            <CategoryDialog onClose={() => setDialogOpen(false)} dialogRef={dialogRef} className="items-center"/>}

        <div className={cn(baseStyles, className,)} {...props}>
            <div className={`flex gap-1 items-center shrink-0 ${showFullWidthSearch ? "hidden" : "flex"}`}>
                <Link to={"/"} className="flex gap-1 items-center">
                    <img src={logo} className="h-14" alt="logo"/>
                    <h1 className="hidden lg:block text-2xl font-bold text-brand">Mazad</h1>
                </Link>
                <IconButton onClick={() => setDialogOpen(true)} size="sm" icon={MdKeyboardArrowDown}
                            iconClassName="text-brand">Categories</IconButton>
            </div>

            {showFullWidthSearch && <IconButton onClick={() => setShowFullWidthSearch(false)} icon={MdKeyboardArrowLeft}
                                                iconClassName="text-brand" size="md"/>}
            <SearchBar className={`${showFullWidthSearch ? "flex" : "hidden md:flex"}`}/>
            <div className={`flex flex-row items-center gap-0 ${showFullWidthSearch ? "hidden" : "flex"}`}>
                <IconButton onClick={() => setShowFullWidthSearch(true)} icon={BiSearch} iconClassName="text-brand"
                            size="md" className="flex md:hidden"/>
                {!isAuthenticated && <TextButton link={"/how-it-works"} className="hidden md:flex mx-2" size="sm">How it works?</TextButton>}
                {!isAuthenticated && <TextButton link={"/about"} className="hidden md:flex ml-2 mr-4" size="sm">About Us</TextButton>}
                {isAuthenticated && <Balance/>}
                {isAuthenticated && <NotificationBell/>}
                {isAuthenticated ?
                    <UserMenu className="ms-0 sm:ms-3" user={user}/> :
                    <Button link={"/login"} className="">Sign in</Button>
                }

            </div>

        </div>
    </>
}


export default HeaderSection