import {cn} from "../../lib/utils.ts";
import IconButton from "../Button/IconButton.tsx";
import {MdClose, MdKeyboardArrowLeft, MdKeyboardArrowRight} from "react-icons/md";
import * as React from "react";
import {useEffect, useState} from "react";
import TextButton from "../Button/TextButton.tsx";
import Button from "../Button/Button.tsx";
import Checkbox from "../CheckBox/Checkbox.tsx";
import {type AppliedFilter, type Filter} from "../FilterList.tsx";


interface FilterDialogProps {
    onClose: () => void;
    selectedFilter?: Filter | null;
    setSelectedFilter: (filter: Filter | null) => void;
    dialogRef?: React.RefObject<HTMLDialogElement | null>;
    filterData: Filter[];
    appliedFilters: AppliedFilter[];
    onApply: (filters: AppliedFilter[]) => void;
    onClear: () => void;
}

const FilterDialog = ({
                          filterData,
                          selectedFilter = null,
                          setSelectedFilter,
                          onClose,
                          dialogRef,
                          onApply,
                          onClear,
                          appliedFilters
                      }: FilterDialogProps) => {
    const baseStyles = "ml-auto h-screen w-105 px-2 py-4 bg-white flex flex-col items-end outline-none max-h-none";
    const [draftFilters, setDraftFilters] = useState<AppliedFilter[]>([]);

    const toggleDraftFilter = (filterId: string, optionIds: string[]) => {
        setDraftFilters(oldFilters => {
            if (optionIds.length === 0) return oldFilters.filter(filter => filter.filterId !== filterId);

            const filterExist = oldFilters.some(filter => filter.filterId === filterId);

            if (filterExist) {
                return oldFilters.map(filter => {
                    if (filter.filterId === filterId) return {filterId: filter.filterId, optionIds}
                    return filter;
                })
            }
            return [...oldFilters, {filterId, optionIds}]
        })
    }

    const getSelectedOptions = (filterId: string) => {
        return draftFilters.find(filter => filter.filterId === filterId)?.optionIds || []
    }

    useEffect(() => {
        setDraftFilters(appliedFilters)
    }, [])
    return (
        <dialog ref={dialogRef} className={cn(baseStyles)}>
            <div className="flex flex-row gap-4 w-full items-center justify-between">
                {!selectedFilter &&
                    <IconButton onClick={() => onClose()} className="" icon={MdClose} iconClassName="text-brand"/>}
                {selectedFilter &&
                    <IconButton onClick={() => setSelectedFilter(null)} className="" icon={MdKeyboardArrowLeft}
                                iconClassName="text-brand"/>}
                <span className="text-black text-base font-semibold">
                    {selectedFilter ? selectedFilter.name : "Filters"}
                </span>
                <TextButton onClick={() => {
                    setDraftFilters([]);
                    onClear();
                }} className={`text-brand ${selectedFilter ? "invisible" : "visible"}`}>Clear</TextButton>
            </div>

            {selectedFilter && <Checkbox
                onOptionToggle={(optionIds) => toggleDraftFilter(selectedFilter.id, optionIds)}
                options={selectedFilter.options}
                selectionMode={selectedFilter.selectionMode}
                selectedOptions={getSelectedOptions(selectedFilter.id)}
                className="flex-1 py-4"/>}
            {!selectedFilter && <ul className="flex flex-col gap-4 w-full overflow-y-auto py-4 flex-1">
                {filterData.map((filter) =>
                    <FilterItem onClick={() => setSelectedFilter(filter)} name={filter.name}/>
                )}
            </ul>}
            <Button onClick={() => {
                onApply(draftFilters);
                onClose();
            }} className="p-4 w-full">Apply</Button>
        </dialog>
    )
}


interface FilterItemProps extends React.HTMLAttributes<HTMLLIElement> {
    name?: string;
}

const FilterItem = ({name = "Unknown", ...props}: FilterItemProps) => {
    const baseStyles = "cursor-pointer flex flex-row gap-4 w-full ps-4 pe-6 items-center justify-between hover:bg-muted";
    return (
        <li className={cn(baseStyles, props.className)} {...props}>
            <span className="text-base py-3 font-semibold">{name}</span>
            <MdKeyboardArrowRight className="text-brand shrink-0 size-6"/>
        </li>
    )
}

export default FilterDialog