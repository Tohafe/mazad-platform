import type {Category} from "./category.ts";

export type AuctionStatus =
    | "DRAFT"
    | "ACTIVE"
    | "SOLD"
    | "EXPIRED"
    | "CANCELLED"
    | "CLOSED";

export interface AuctionSummary {
    id: number;
    title: string;
    thumbnail: string;
    currentBid: number;
    status: AuctionStatus;
    startsAt: string;
    endsAt: string;
}

export interface CategorizedAuctions {
    category: Category;
    items: AuctionSummary[]
}

export interface AuctionFilters {
    // pagination
    page?: number;
    size?: number;

    // main filters
    categoryId?: number;
    status?: string;

    // price filtering (budget)
    minPrice?: number;
    maxPrice?: number;

    // closing date filtering
    endsBefore?: string;   // ISO date string
    endsAfter?: string;    // ISO date string

    // optional useful filters
    keyword?: string;
    sellerId?: number;

    // sorting
    sort?: string;
}
