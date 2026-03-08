import {useEffect, useMemo, useState} from "react";
import {formatTimeLeft} from "./timeFormater.ts";
import type {AuctionStatus} from "../types/item.ts";

export const useAuctionTimeLeft = (
    status: AuctionStatus,
    endsAt: string
) => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);

    return useMemo(() => {
        return formatTimeLeft(status, endsAt, now, "long");
    }, [status, endsAt, now]);
};