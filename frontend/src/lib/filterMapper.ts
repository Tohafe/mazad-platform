import type {AppliedFilter} from "../components/Filter/FilterList.tsx";
import type {AuctionFilters} from "../types/item.ts";

const filterByStatus = (filter: AppliedFilter) => {
    const selected = filter.options[0];
    if (selected.id === "open") return "ACTIVE";
    if (selected.id === "sold") return "SOLD";
    if (selected.id === "expired") return "EXPIRED";
    return undefined;
}

const filterByMinMaxPrice = (filter: AppliedFilter): Partial<AuctionFilters> => {
    const selected = filter.options[0];
    if (selected.id === "under5")
        return { minPrice: 0, maxPrice: 5 };
    if (selected.id === "5to20")
        return { minPrice: 5, maxPrice: 20 };
    if (selected.id === "20to100")
        return { minPrice: 20, maxPrice: 100 };
    if (selected.id === "100to200")
        return { minPrice: 100, maxPrice: 200 };
    if (selected.id === "200to500")
        return { minPrice: 200, maxPrice: 500 };
    if (selected.id === "500to1000")
        return { minPrice: 500, maxPrice: 1000 };
    if (selected.id === "1000to2000")
        return { minPrice: 1000, maxPrice: 2000 };
    if (selected.id === "2000to5000")
        return { minPrice: 2000, maxPrice: 5000 };
    else return {};
}

const startOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
};

const endOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
};

const endOfWeek = (now: Date) => {
    const d = new Date(now);
    const day = d.getDay(); // 0=Sun..6=Sat
    const daysUntilSunday = (7 - day) % 7;
    d.setDate(d.getDate() + daysUntilSunday);
    return endOfDay(d);
};

const filterByClosingDate = (filter: AppliedFilter): Partial<AuctionFilters> => {
    const selected = filter.options?.[0];
    if (!selected) return {};

    const now = new Date();

    let endsAfter: Date | undefined;
    let endsBefore: Date | undefined;

    switch (selected.id) {
        case "today": {
            endsAfter = startOfDay(now);
            endsBefore = endOfDay(now);
            break;
        }
        case "tomorrow": {
            const t = new Date(now);
            t.setDate(t.getDate() + 1);
            endsAfter = startOfDay(t);
            endsBefore = endOfDay(t);
            break;
        }
        case "next3days": {
            const start = new Date(now);
            start.setDate(start.getDate() + 2);
            endsAfter = startOfDay(start);

            const end = new Date(now);
            end.setDate(end.getDate() + 4);
            endsBefore = endOfDay(end);
            break;
        }
        case "next7days": {
            const start = new Date(now);
            start.setDate(start.getDate() + 5);
            endsAfter = startOfDay(start);

            const end = new Date(now);
            end.setDate(end.getDate() + 11);
            endsBefore = endOfDay(end);
            break;
        }
        case "thisWeek": {
            endsAfter = now;
            endsBefore = endOfWeek(now);
            break;
        }
        default:
            return {};
    }

    return {
        ...(endsAfter ? { endsAfter: endsAfter.toISOString() } : {}),
        ...(endsBefore ? { endsBefore: endsBefore.toISOString() } : {}),
    };
};

const filterBySort = (filter: AppliedFilter): Partial<AuctionFilters> => {
    const selected = filter.options?.[0];
    if (!selected) return {};

    if (selected.id === "timeRemaining") return { sort: "endsAt,asc" };
    if (selected.id === "recentlyAdded") return { sort: "createdAt,desc" };
    if (selected.id === "currentBidAsc") return { priceSort: "asc" };
    if (selected.id === "currentBidDesc") return { priceSort: "desc" };


    return {};
};

export function mapFiltersToQuery(applied: AppliedFilter[]): AuctionFilters {
    const query: AuctionFilters = {};

    for (const filter of applied) {
        switch (filter.filterId) {
            case "status":
                query.status = filterByStatus(filter);
                break;
            case "budget":
                Object.assign(query, filterByMinMaxPrice(filter));
                break;
            case "closingDate":
                Object.assign(query, filterByClosingDate(filter));
                break;
            case "sort":
                Object.assign(query, filterBySort(filter));
                break;
        }
    }
    return query;
}