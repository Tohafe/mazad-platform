import Button from "../Button/Button.tsx";
import {BiFilter} from "react-icons/bi";
import {MdClose, MdKeyboardArrowDown} from "react-icons/md";
import {useEffect, useRef, useState} from "react";
import FilterDialog from "./FilterDialog.tsx";
import IconButton from "../Button/IconButton.tsx";


export interface Filter {
    id: string,
    name: string,
    selectionMode: "single" | "multiple",
    options: { id: string, name: string }[]
}

export interface Option {
    id: string,
    name: string
}
export interface AppliedFilter {
    filterId: string,
    options: Option[]
}

export const filterData: Filter[] = [
    {
        id: "budget",
        name: "Budget",
        selectionMode: "single",
        options: [
            {id: "under5", name: "Under $5"},
            {id: "5to20", name: "$5 - $20"},
            {id: "20to100", name: "$20 - $100"},
            {id: "100to200", name: "$100 - $200"},
            {id: "200to500", name: "$200 - $500"},
            {id: "500to1000", name: "$500 - $1000"},
            {id: "1000to2000", name: "$1000 - $2000"},
            {id: "2000to5000", name: "$2000 - $5000"},
        ]
    },
    {
        id: "closingDate",
        name: "Closing date",
        selectionMode: "single",
        options: [
            {id: "today", name: "Today"},
            {id: "tomorrow", name: "Tomorrow"},
            {id: "next3days", name: "Next 3 days"},
            {id: "next7days", name: "Next 7 days"},
            {id: "thisWeek", name: "This week"},
        ],
    },
    {
        id: "status",
        name: "Status",
        selectionMode: "single",
        options: [
            {id: "open", name: "Open"},
            {id: "sold", name: "Sold"},
            {id: "expired", name: "Expired"},
        ],
    },
    {
        id: "sort",
        name: "Sort",
        selectionMode: "single",
        options: [
            {id: "timeRemaining", name: "Time remaining"},
            {id: "currentBidAsc", name: "Current bid (low → high)"},
            {id: "currentBidDesc", name: "Current bid (high → low)"},
        ],
    },
];


const getFilterById = (filterId: string) => filterData.find(f => f.id === filterId)

interface FilterListProps {
    className?: string;
    appliedFilters: AppliedFilter[];
    onApplyFilters: (filters: AppliedFilter[]) => void;
}

const FilterList = ({className = "", appliedFilters, onApplyFilters}: FilterListProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);


    const openDialog = (filter: Filter | null) => {
        setDialogOpen(true);
        setSelectedFilter(filter);
    }

    const removeAppliedFilter = (filterId: string) => {
        const newAppliedFilters = appliedFilters.filter(filter => filter.filterId !== filterId);
        onApplyFilters(newAppliedFilters);
    }

    useEffect(() => {
        if (!dialogRef.current) return;
        if (dialogOpen) dialogRef.current?.showModal();
        else dialogRef.current?.close();
    }, [dialogOpen])
    const baseStyles = "flex flex-col w-full gap-4 pt-6";

    return (
        <div className={`${baseStyles} ${className}`}>

            {dialogOpen && <FilterDialog
                filterData={filterData}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                onClose={() => setDialogOpen(false)}
                dialogRef={dialogRef}
                appliedFilters={appliedFilters}
                onClear={() => onApplyFilters([])}
                onApply={(filters) => onApplyFilters(filters)}
            />}

            <ol className="flex flex-row gap-2 overflow-x-auto">
                <li><Button key={0} onClick={() => openDialog(null)} className="text-black font-medium" variant="secondary"
                            children="Filters" icon={BiFilter}/>
                </li>
                {filterData.map((filter) => <li key={filter.id}><Button onClick={() => openDialog(filter)}
                                                        className="text-black font-medium" variant="secondary"
                                                        children={filter.name}
                                                        icon={MdKeyboardArrowDown} iconPos="right"/></li>)}
            </ol>

            <div className="w-full h-[0.5px] bg-border"/>
            <ol className="flex flex-row gap-2 overflow-y-auto">
                {appliedFilters.map((filter) =>
                    <IconButton key={filter.filterId}
                                onClick={() => removeAppliedFilter(filter.filterId)}
                                className="bg-muted" variant="outlined" icon={MdClose}
                                iconPos="right"


                    >
                        {getFilterById(filter.filterId)?.name}: {filter.options.map(option => option.name)}
                    </IconButton>
                )}
            </ol>
        </div>
    )
}


export default FilterList