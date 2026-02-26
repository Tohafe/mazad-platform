

import type {AuctionStatus} from "./item.ts";

export type AuctionUpdateEvent = {
    auctionId: number,
    currentHighestBid: number,
    endsAt: string,
    status: AuctionStatus,
    lastBidderId: string | null
}