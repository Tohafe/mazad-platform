import {cn} from "../lib/utils.ts";
import type {FooterElement} from "./Footer.tsx";

export interface TableData {
    title: string;
    rows: FooterElement[];
}

interface TableProps {
    className?: string;
    table: TableData;
}

const Table = ({className = "", table}: TableProps) => {
    const scrollUp = () => window.scroll({top: 0, behavior: "smooth"});

    return <div className={cn("flex flex-col gap-5", className)}>
        <span className="font-medium text-base">{table.title}</span>
        {table.rows.map((row, index: number) =>
            <a
                onClick={scrollUp}
                href={row.url}
                target={row.external ? "_blank" : undefined}
                rel="noopener noreferrer"
                key={index}
                className="hover:underline font-medium text-secondary text-sm"

            >{row.title}</a>
        )
        }
    </div>
}


export default Table