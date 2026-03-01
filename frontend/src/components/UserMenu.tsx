import type User from "../types/user.ts";
import {cn} from "../lib/utils.ts";
import IconButton from "./Button/IconButton.tsx";
import {MdKeyboardArrowDown} from "react-icons/md";
import {FaRegUser} from "react-icons/fa";
import Dropdown from "./Dropdown.tsx";
import {useState} from "react";
import TextButton from "./Button/TextButton.tsx";
import {useSignOut} from "../hooks/useAuctions.ts";


interface UserMenuProps {
    className?: string
    user?: User | null
}


const UserMenu = ({className = "", user}: UserMenuProps) => {
    const mutation = useSignOut();
    const [open, setOpen] = useState(false);


    return <div className={cn("relative inline-flex gap-1 items-center min-w-0", className)}>
        <div onClick={() => setOpen(!open)}>
            {user?.avatarUrl ? (
                <img
                    className="shrink-0 h-8 w-8 rounded-full object-cover border border-border"
                    src={user?.avatarUrl}
                    alt={"avatar"}
                />) : (
                <FaRegUser size={20} className="shrink-0 text-brand"/>)
            }
        </div>

        <IconButton className={`hidden sm:block`} onClick={() => setOpen(!open)} icon={MdKeyboardArrowDown} size={"sm"}
                    iconPos={"right"}>{user?.username}</IconButton>
        <Dropdown className="w-60 right-0 left-auto pt-2 border-t-[0.5px] p-2" open={open}>
            <div className="flex justify-between items-center px-2 py-3">
                <span className="font-mono font-thin text-sm text-muted">ACCOUNT</span>
            </div>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Messages</MenuItem>
            <TextButton onClick={() => mutation.mutate()} className="text-secondary">Sign out</TextButton>
        </Dropdown>
    </div>
}


const MenuItem = ({children}: { children: React.ReactNode }) => {
    return <div
        className="flex gap-4 items-center font-medium text-base text-primary px-4 py-2 hover:bg-gray-100 cursor-pointer">{children}</div>
}
export default UserMenu;
