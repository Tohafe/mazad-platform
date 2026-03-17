import TableGrid from "./Grid/TableGrid.tsx";
import type {TableData} from "./Table.tsx";
import {cn} from "../lib/utils.ts";
import Button from "./Button/Button.tsx";
import logo from "../assets/logo.png"
import {FaFacebook, FaInstagram} from "react-icons/fa";
import Divider from "./Divider.tsx";
import {useAuth} from "../context/AuthProvider.tsx";

const tables: TableData[] = [
    {
        title: "Team",
        rows: [
            {title: "About Us", url: "/about"},
            {title: "How it works", url: "/how-it-works"},
            {title: "Technologies", url: "/technologies"},
            {title: "API Documentation", url: "https://localhost/docs/index.html", external: true},
        ]
    },
    {
        title: "Legal",
        rows: [
            {title: "Privacy Policy", url: "/privacy-policy"},
            {title: "Terms of Service", url: "/terms-of-service"},
        ]
    },
    {
        title: "Account",
        rows: [
            {title: "My Listing", url: "/dashboard"},
            {title: "List an item", url: "/listing"},
            {title: "Conversations", url: "/inbox"},
            {title: "Settings", url: "/settings"},
        ]
    },
    {
        title: "Resources",
        rows: [
            { title: "React Documentation", url: "https://react.dev/reference/react", external: true },
            { title: "TypeScript Tutorial", url: "https://www.youtube.com/watch?v=d56mG7DezGs", external: true },
            { title: "Spring Documentation", url: "https://spring.io/projects", external: true },
            { title: "Spring Tutorial", url: "https://www.youtube.com/watch?v=4XTsAAHW_Tc", external: true },
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
                <a href="/"><img src={logo} alt="Logo" className="w-12 cursor-pointer"/></a>
                <a href="/"><FaFacebook size={24} className="text-muted"/></a>
                <a href="/"><FaInstagram size={24} className="text-muted"/></a>
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