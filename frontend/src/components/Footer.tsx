import TableGrid from "./Grid/TableGrid.tsx";
import type {TableData} from "./Table.tsx";
import {cn} from "../lib/utils.ts";
import Button from "./Button/Button.tsx";
import logo from "../assets/logo.png"
import {FaFacebook, FaInstagram} from "react-icons/fa";
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
        title: "Legal",
        rows: [
            "Privacy Policy",
            "Terms of Service",
            "Cookie Policy",
            "Licenses"
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
    {title: "Privacy Policy", url: "/"},
    {title: "Terms of Service", url: "/"},
    {title: "Cookie Policy", url: "/"},
    {title: "Licenses", url: "/"},
]

interface FooterProps {
    className?: string
}

const Footer = ({className = ""}) => {
    return <div className={cn("flex flex-col gap-4 py-12", className)}>
        <Divider/>
        <AccountSection/>
        <Divider/>
        <TableGrid className="my-6 grid-cols-2 md:grid-cols-4" tables={tables}/>
        <Divider/>
        <div className="flex gap-4 items-center justify-between w-full">
            <div className="flex gap-4">
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
            <Button>Sign In</Button>
            <Button>Register</Button>
        </div>

        <p className="line-clamp-1 text-[15px] font-medium invisible lg:visible">Bid on over 65,000 special objects
            every week, selected by 240+ experts</p>
    </div>
}

const Divider = () => {
    return <div className="relative left-1/2 -ml-[50vw] w-screen h-[0.5px] bg-border"></div>
}

export default Footer