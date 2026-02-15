import {cn} from "../lib/utils.ts";

export interface TableData {
    title: string;
    rows: string[];
}

interface TableProps {
    className?: string;
    table: TableData;
}

const Table = ({className = "", table}: TableProps) => {

    return <div className={cn("flex flex-col gap-5", className)}>
        <span className="font-medium text-base">{table.title}</span>
        {table.rows.map((row, index: number) =>
            <a href="/" key={index} className="hover:underline font-medium text-secondary text-sm">{row}</a>)
        }
    </div>
}


export default Table