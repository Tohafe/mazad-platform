import Table, {type TableData} from "../Table.tsx";
import {cn} from "../../lib/utils.ts";


interface TableGridProps {
    className?: string
    tables: TableData[]
}

const TableGrid = ({className = "", tables}: TableGridProps) => {
    return <div className={cn("grid grid-cols-4 gap-12 max-w-305", className)}>
        {tables.map((table) => <Table key={table.title} table={table}/>)}
    </div>
}


export default TableGrid;