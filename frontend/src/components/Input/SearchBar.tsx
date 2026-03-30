import {BiSearch} from "react-icons/bi";
import {type FormHTMLAttributes, useEffect, useState} from "react";
import {cn} from "../../lib/utils.ts";
import TextField from "./TextField.tsx";
import Dropdown from "../Dropdown.tsx";
import HistoryItem from "../HistoryItem.tsx";
import TextButton from "../Button/TextButton.tsx";
import {useNavigate} from "react-router-dom";


interface SearchBarProps extends FormHTMLAttributes<HTMLFormElement> {
    className?: string
}

const HISTORY_KEY = "search_history";
const HISTORY_LIMIT = 10;

const SearchBar = ({className = ""}: SearchBarProps) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [history, setHistory] = useState<string[]>(() => {
        try {
            const raw = localStorage.getItem(HISTORY_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
                return parsed;
            }
        } catch (e) {
        }
        return [];
    });

    const open = isFocused && history.length > 0;

    useEffect(() => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }, [history]);

    const addToHistory = (value: string) => {
        setHistory((prev) => {
            const next = [value, ...prev.filter((x) => x !== value)];
            return next.slice(0, HISTORY_LIMIT);
        })
    }

    const submitSearch = (query: string) => {
        setIsFocused(false);
        const trimmed = query.trim();
        if (!trimmed) return;
        addToHistory(trimmed)
        navigate(`/search?q=${trimmed}`)
    }

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitSearch(query);
    }

    const handleClear = () => {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    }

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-row max-w-150 grow items-center", className)}>
            <div className="relative w-full">
                <TextField
                    className="w-full"
                    hint={"Type what you are looking for..."}
                    icon={BiSearch}
                    value={query}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={setQuery}
                />

                <Dropdown open={open}>
                    {open && <div className="flex justify-between items-center p-5">
                        <span className="font-mono font-thin text-base text-muted">RECENT SEARCHES</span>
                        <TextButton onMouseDown={handleClear} className="text-secondary">Clear</TextButton>
                    </div>}
                    {history.map((item) =>
                        <HistoryItem key={item} onMouseDown={() => submitSearch(item)} >{item}</HistoryItem>
                    )}
                </Dropdown>
            </div>
        </form>
    )
}

export default SearchBar