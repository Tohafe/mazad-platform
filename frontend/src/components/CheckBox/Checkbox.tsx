import {type HTMLAttributes, useEffect, useState} from "react";
import {cn} from "../../lib/utils.ts";
import {FiCheck} from "react-icons/fi";

interface Option {
    id: string;
    name: string;
}

interface CheckboxProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    title?: string;
    selectionMode: "single" | "multiple";
    options?: Option[];
    selectedOptions: string[];
    onOptionToggle?: (optionId: string[]) => void;
}

const Checkbox = ({
                      className = "",
                      title = "",
                      selectionMode = "multiple",
                      options,
                      selectedOptions = [],
                      onOptionToggle,
                      ...props
                  }: CheckboxProps) => {
    const [selected, setSelected] = useState<string[]>([])
    const baseStyles = "flex flex-col gap-3 w-full overflow-y-auto";

    useEffect(() => {
        setSelected(selectedOptions);
        console.log("selected options: " + selectedOptions)
    }, [])
    const toggleOption = (selectedId: string) => {
        let sOptions: string[];
        if (selectionMode === "single") {
            sOptions = selected.includes(selectedId) ? [] : [selectedId];
        } else
            sOptions = selected.includes(selectedId)
                ? selected.filter((id) => id !== selectedId)
                : [...selected, selectedId];
        setSelected(sOptions);
        console.log("Selected: " + sOptions);
        onOptionToggle && onOptionToggle(sOptions);
    }
    return (
        <div className={cn(baseStyles, className)} {...props}>
            <span>{title}</span>
            <div className="flex flex-col gap-3">
                {options?.map((option) => <CBItem checked={selected.includes(option.id)}
                                                  onChange={() => toggleOption(option.id)} option={option}/>)}
            </div>
        </div>
    )
}


interface CBItemProps {
    option: Option;
    checked: boolean;
    onChange: () => void;
}


const CBItem = ({option, checked, onChange}: CBItemProps) => {
    const baseStyles = "flex gap-6 font-semibold hover:bg-muted ps-4 pe-6 py-3";
    return (
        <label onClick={onChange} className={cn(baseStyles)} key={option.id}>
            {!checked && <div className="w-6 aspect-square border-2 border-gray-400 shrink-0"></div>}
            {checked && <div className="flex items-center w-6 aspect-square bg-brand shrink-0">
                <FiCheck className="w-full text-white size-5"/>
            </div>}
            {option.name}
        </label>
    )
}

export default Checkbox