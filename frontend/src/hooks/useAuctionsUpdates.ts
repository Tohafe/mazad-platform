import {useEffect} from "react";
import type {AuctionUpdateEvent} from "../types/auctionUpdateEvent.ts";
import {type QueryClient, useQueryClient} from "@tanstack/react-query";
import type {AuctionSummary, CategorizedAuctions} from "../types/item.ts";
import type {Page} from "../types/pagination.ts";
import { useWebSocket } from "../context/WebSocketContext.tsx";

function updateAuctionPage(
    oldPage: Page<AuctionSummary> | undefined,
    event: AuctionUpdateEvent
): Page<AuctionSummary> | undefined {
    if (!oldPage) return oldPage;

    return {
        ...oldPage,
        content: updateAuctions(oldPage.content, event),
    };
}

function updateAuctions(oldAuctions: AuctionSummary[] = [], event: AuctionUpdateEvent) {
    if (!oldAuctions) return oldAuctions;
    // if (event.status !== "ACTIVE")
    //     return oldAuctions.filter((auction) => auction.id !== event.auctionId);
    return oldAuctions.map((auction) => {
        if (auction.id !== event.auctionId) return auction;
        return {
            ...auction,
            currentBid: event.currentHighestBid,
            endsAt: event.endsAt,
            status: event.status
        };
    })
}

export function updateCache(queryClient: QueryClient, event: AuctionUpdateEvent) {
    queryClient.setQueriesData(
        {queryKey: ["auctions", "ending-soon"]},
        (oldData: AuctionSummary[]) => updateAuctions(oldData, event),
    )
    queryClient.setQueriesData(
        {queryKey: ["auctions", "categorized"]},
        (oldData: CategorizedAuctions[]) => oldData.map(
            (catAuction) => {
                return {
                    category: catAuction.category,
                    items: updateAuctions(catAuction.items, event)
                }
            }
        )
    )

    queryClient.setQueriesData(
        {queryKey: ["auctions", "list"]},
        (oldData: Page<AuctionSummary>) => updateAuctionPage(oldData, event)
    )

    queryClient.setQueriesData(
        {queryKey: ["my-auctions"]},
        (oldData: Page<AuctionSummary>) => updateAuctionPage(oldData, event)
    )
}


export function useAuctionsUpdates() {
    const { stompClient, isConnected } = useWebSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!stompClient || !isConnected) return;
            console.log("WS connected. Subscribing to /topic/auctions");
            const subscription = stompClient.subscribe("/topic/auctions", (message) => {
                console.log("Subscribed! to /topic/auctions");
                console.log("WS /topic/auctions:", message.body);
                try {
                    const event = JSON.parse(message.body) as AuctionUpdateEvent;
                    updateCache(queryClient, event);
                    console.log("WS parsed:", event);
                } catch (e) {
                    console.error("WS parse error:", e);
                }
            })
            return () => {
                subscription.unsubscribe();
            };
    }, [stompClient, isConnected]);
}