import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
}

export default function Select({ label, options, ...props }: SelectProps) {
   return (
    <div className="bg-muted relative">
        <select  {...props} className=" w-full h-full pl-3 pt-3">
            {options.map((opt) => (
                <option key={opt} value={opt} className="border"> {opt} </option>
            )
            )}
        </select>
        <label className="absolute text-secondary text-xs left-4 top-2">
            {label}
        </label>
    </div>
    )
}