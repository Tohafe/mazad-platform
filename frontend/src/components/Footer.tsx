import TableGrid from "./Grid/TableGrid.tsx";
import type {TableData} from "./Table.tsx";
import {cn} from "../lib/utils.ts";
import Button from "./Button/Button.tsx";
import logo from "../assets/logo.png"
import {FaFacebook, FaInstagram} from "react-icons/fa";
import Divider from "./Divider.tsx";
import {useAuth} from "../context/AuthProvider.tsx";


const MAZAD_IP = import.meta.env.VITE_MAZAD_IP;
const tables: TableData[] = [
    {
        title: "Team",
        rows: [
            {title: "About Us", url: "/about", external: true},
            {title: "How it works", url: "/how-it-works", external: true},
            {title: "Technologies", url: "/technologies", external: true},
            {title: "API Documentation", url: `https://${MAZAD_IP}/docs/index.html`, external: true},
        ]
    },
    {
        title: "Legal",
        rows: [
            {title: "Privacy Policy", url: "/privacy-policy", external: true},
            {title: "Terms of Service", url: "/terms-of-service", external: true},
        ]
    },
    {
        title: "Account",
        rows: [
            {title: "My Listing", url: "/dashboard", external: true},
            {title: "List an item", url: "/listing", external: true},
            {title: "Conversations", url: "/inbox", external: true},
            {title: "Settings", url: "/settings", external: true},
        ]
    },
    {
        title: "Support",
        rows: [
            { title: "Help Center", url: "/help", external: true },
            { title: "Bidding Guide", url: "/guide", external: true }
        ]
    }
];

export type FooterElement = {
    title: string, url: string, external?: boolean
}

interface FooterProps {
    className?: string
}

const Footer = ({className = ""}: FooterProps) => {
    const {isAuthenticated} = useAuth();

    return <div className={cn("flex flex-col gap-4 py-12", className)}>
        {!isAuthenticated && <Divider/>}
        {!isAuthenticated && <AccountSection/>}
        <Divider/>
        <TableGrid className="my-6 grid-cols-2 md:grid-cols-4" tables={tables}/>
        <Divider/>
        <div className="flex gap-4 items-center justify-between w-full">
            <div className="flex justify-end items-center gap-4">
                <a href="/"><img src={logo} alt="Logo" className="h-12 w-12 aspect-square shrink-0 cursor-pointer"/></a>
                <a href="https://www.facebook.com/profile.php?id=61576446457600" target={"_blank"} rel="noopener noreferrer"><FaFacebook size={24} className="text-muted"/></a>
                <a href="https://www.instagram.com/mazad_platform/" target={"_blank"} rel="noopener noreferrer"><FaInstagram size={24} className="text-muted"/></a>
            </div>

        </div>
    </div>
}


const AccountSection = ({className = ""}) => {
    return <div className={cn("flex justify-between items-center gap-4", className)}>
        <div className="flex gap-4">
            <Button link={"/login"}>Sign In</Button>
            <Button link={"/register"}>Register</Button>
        </div>

        <p className="line-clamp-1 text-[15px] font-medium invisible lg:visible">Bid on over 65,000 special objects
            every week.</p>
    </div>
}


export default Footer