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
        title: "Company",
        rows: [
            "About Us",
            "Careers",
            "Press",
            "Blog"
        ]
    },
    {
        title: "Support",
        rows: [
            "Help Center",
            "Contact Us",
            "Status",
            "FAQs"
        ]
    },
    {
        title: "Account",
        rows: [
            "My Profile",
            "My Listing",
            "Settings"
        ]
    },
    {
        title: "Resources",
        rows: [
            "Documentation",
            "API Reference",
            "Community",
            "Developers"
        ]
    }
];

const LegalItemData: { title: string, url: string }[] = [
    {title: "Privacy Policy", url: "/privacy-policy"},
    {title: "Terms of Service", url: "/terms-of-service"},
    {title: "Cookie Policy", url: "/"},
    {title: "Licenses", url: "/"},
]

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
            <div className="grid grid-cols-2 md:flex gap-4">
                {LegalItemData.map((item, index) =>
                    <a className="text-[15px] text-secondary font-medium hover:underline" href={item.url}
                       key={index}>{item.title}</a>
                )}
            </div>
            <div className="flex justify-end items-center gap-4">
                <a href="/" ><FaFacebook size={24} className="text-muted"/></a>
                <a href="/" ><FaInstagram size={24} className="text-muted"/></a>
                <a href="/" ><img src={logo} alt="Logo" className="w-12 cursor-pointer"/></a>
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