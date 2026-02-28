import {BiSearch} from "react-icons/bi";
import {type FormHTMLAttributes, useEffect, useState} from "react";
import {cn} from "../../lib/utils.ts";
import TextField from "./TextField.tsx";
import Dropdown from "../Dropdown.tsx";
import HistoryItem from "../HistoryItem.tsx";
import TextButton from "../Button/TextButton.tsx";


interface SearchBarProps extends FormHTMLAttributes<HTMLFormElement> {
    className?: string
}

const HISTORY_KEY = "search_history";
const HISTORY_LIMIT = 10;

const SearchBar = ({className = ""}: SearchBarProps) => {
    const [query, setQuery] = useState("");
    const [history, setHistory] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    const open = isFocused && history.length > 0;

    useEffect(() => {
        try {
            const raw = localStorage.getItem(HISTORY_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
                setHistory(parsed);
            }
        } catch (e) {
            console.error("Failed to load search history:", e);
        }
    }, []);

    useEffect(() => {
        if (history.length > 0)
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }, [history]);

    const addToHistory = (value: string) => {
        setHistory((prev) => {
            const next = [value, ...prev.filter((x) => x !== value)];
            return next.slice(0, HISTORY_LIMIT);
        })
    }
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsFocused(false);
        const trimmed = query.trim();
        if (!trimmed) return;

        console.log("Searching for:", trimmed);
        addToHistory(trimmed)

    }

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-row w-full max-w-150 grow items-center", className)}>
            <div className="relative w-full">
                <TextField
                    className="w-full"
                    hint={"Search for brand, model, artist..."}
                    icon={BiSearch}
                    value={query}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={setQuery}
                />

                <Dropdown open={open}>
                    {open && <div className="flex justify-between items-center p-5">
                        <span className="font-mono font-thin text-base text-muted">RECENT SEARCHES</span>
                        <TextButton className="text-secondary">Clear</TextButton>
                    </div>}
                    {history.map((item) => <HistoryItem key={item}>{item}</HistoryItem>)}
                </Dropdown>
            </div>
        </form>
    )
}

export default SearchBar