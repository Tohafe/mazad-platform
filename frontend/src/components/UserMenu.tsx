import type User from "../types/user.ts";
import {cn} from "../lib/utils.ts";
import IconButton from "./Button/IconButton.tsx";
import {MdKeyboardArrowDown} from "react-icons/md";
import {FaRegUser} from "react-icons/fa";
import Dropdown from "./Dropdown.tsx";
import {useState} from "react";
import TextButton from "./Button/TextButton.tsx";
import {useSignOut} from "../hooks/useAuctions.ts";
import {Link} from "react-router-dom";


interface UserMenuProps {
    className?: string
    user?: User | null
}


const UserMenu = ({className = "", user}: UserMenuProps) => {
    const mutation = useSignOut();
    const [open, setOpen] = useState(false);


    return <div className={cn("relative flex gap-1 items-center min-w-0", className)}>
        <div className="flex items-center w-8 h-8" onClick={() => setOpen(!open)}>
            {user?.avatarUrl ? (
                <img
                    className="shrink-0 w-full h-full rounded-full object-cover cursor-pointer"
                    src={user?.avatarUrl}
                    alt={"avatar"}
                />) : (
                <FaRegUser size={20} className="shrink-0 text-brand"/>)
            }
        </div>

        <IconButton className={`hidden sm:block`} onClick={() => setOpen(!open)} icon={MdKeyboardArrowDown} size={"sm"}
                    iconPos={"right"}><span className="block max-w-32  truncate">{user?.username ?? ""}</span></IconButton>
        <Dropdown className="w-60 right-0 left-auto pt-2 border-t-[0.5px] p-2" open={open}>
            <MenuSection>ACCOUNT</MenuSection>
            <MenuItem link={"/profile"}>Profile</MenuItem>
            <MenuItem link={"/settings"}>Settings</MenuItem>
            <MenuItem link={"/conversations"}>Messages</MenuItem>
            <MenuSection>LISTING</MenuSection>
            <MenuItem link={"/listing"}>List an item</MenuItem>
            <TextButton onClick={() => mutation.mutate()} className="pt-3">Sign out</TextButton>
        </Dropdown>
    </div>
}


const MenuItem = ({link, children}: {link?:string, children: React.ReactNode }) => {
    return <Link to={link ?? ""}
        className="flex gap-4 items-center font-medium text-base text-primary px-4 py-2 hover:bg-gray-100 cursor-pointer">{children}</Link>
}

const MenuSection = ({children}: {children: React.ReactNode}) => {
    return <div className="flex justify-between items-center px-2 py-3">
        <span className="font-mono font-thin text-sm text-muted">{children}</span>
    </div>
}
export default UserMenu;
