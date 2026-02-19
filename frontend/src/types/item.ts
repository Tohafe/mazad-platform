import type {Category} from "./category.ts";

export type AuctionStatus =
    | "DRAFT"
    | "ACTIVE"
    | "SOLD"
    | "EXPIRED"
    | "CANCELLED";

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
    page?: number;
    size?: number;
    categoryId?: number;
    status?: string;
}
