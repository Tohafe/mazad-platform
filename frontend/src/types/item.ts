export type AuctionStatus =
    | "DRAFT"
    | "ACTIVE"
    | "SOLD"
    | "EXPIRED"
    | "CANCELLED";

export interface ItemSummary {
    title: string;
    thumbnail: string;
    currentBid: number;
    status: AuctionStatus;
    startsAt: string;
    endsAt: string;
}

