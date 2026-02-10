import Button from "./Button/Button.tsx";
import {BiFilter} from "react-icons/bi";
import {MdClose, MdKeyboardArrowDown} from "react-icons/md";
import {useEffect, useRef, useState} from "react";
import FilterDialog from "./Dialog/FilterDialog.tsx";
import IconButton from "./Button/IconButton.tsx";


export interface Filter {
    id: string,
    name: string,
    selectionMode: "single" | "multiple",
    options: { id: string, name: string }[]
}

export interface AppliedFilter {
    filterId: string,
    optionIds: string[]
}

export const filterData: Filter[] = [
    {
        id: "budget",
        name: "Budget",
        selectionMode: "single",
        options: [
            {id: "under5", name: "Under $5"},
            {id: "5to20", name: "$5 - $20"},
        ]
    },
    {
        id: "closingDate",
        name: "Closing date",
        selectionMode: "multiple",
        options: [
            {id: "today", name: "Today"},
            {id: "tomorrow", name: "Tomorrow"},
        ],
    },
    {
        id: "status",
        name: "Status",
        selectionMode: "multiple",
        options: [
            {id: "open", name: "Open"},
            {id: "closed", name: "Closed"},
        ],
    },
];


const getFilterById = (filterId: string) => filterData.find(f => f.id === filterId)

const FilterList = ({className = ""}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const baseStyles = "flex flex-col w-full gap-4 pt-6";
    const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null)
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([])

    useEffect(() => {
        console.log("Applied Filters: " + appliedFilters.map(f => f.filterId))
    }, [appliedFilters]);

    const openDialog = (filter: Filter | null) => {
        setDialogOpen(true);
        setSelectedFilter(filter);
    }

    const removeAppliedFilter = (filterId: string)=> {
        const newAppliedFilters = appliedFilters.filter(filter => filter.filterId !== filterId);
        setAppliedFilters(newAppliedFilters);
    }

    useEffect(() => {
        if (!dialogRef.current) return;
        if (dialogOpen) dialogRef.current?.showModal();
        else dialogRef.current?.close();
    }, [dialogOpen])
    return (
        <div className={`${baseStyles} ${className}`}>

            {dialogOpen && <FilterDialog
                filterData={filterData}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                onClose={() => setDialogOpen(false)}
                dialogRef={dialogRef}
                appliedFilters={appliedFilters}
                onClear={() => setAppliedFilters([])}
                onApply={(filters) => setAppliedFilters(filters)}
            />}

            <ol className="flex flex-row gap-2 overflow-x-auto">
                <li><Button onClick={() => openDialog(null)} className="text-black font-medium" variant="secondary"
                            children="Filters" icon={BiFilter}/>
                </li>
                {filterData.map((filter) => <li><Button onClick={() => openDialog(filter)}
                                                        className="text-black font-medium" variant="secondary"
                                                        children={filter.name}
                                                        icon={MdKeyboardArrowDown} iconPos="right"/></li>)}
            </ol>

            <div className="w-full h-[0.5px] bg-border"/>
            <ol className="flex flex-row gap-2 overflow-x-auto">
                {appliedFilters.map((filter) =>
                    <IconButton onClick={() => removeAppliedFilter(filter.filterId)} className="bg-muted" variant="outlined" icon={MdClose} iconPos="right">{getFilterById(filter.filterId)?.name}</IconButton>
                )}
            </ol>
        </div>
    )
}


export default FilterList