import {useEffect, useState} from "react";
import {Client} from "@stomp/stompjs";
import type {AuctionUpdateEvent} from "../types/auctionUpdateEvent.ts";
import {type QueryClient, useQueryClient} from "@tanstack/react-query";
import type {AuctionSummary, CategorizedAuctions} from "../types/item.ts";
import type {Page} from "../types/pagination.ts";

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
}

export function useAuctionsUpdates() {
    const [connected, setConnected] = useState(false);
    const [lastEvent, setLastEvent] = useState<AuctionUpdateEvent | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const client = new Client({
            brokerURL: "ws://localhost:8000/ws",
            reconnectDelay: 2000,
            debug: (s) => console.log("[stomp]", s),
        });

        client.onConnect = () => {
            setConnected(true);
            console.log("WS connected. Subscribing to /topic/items");
            client.subscribe("/topic/items", (message) => {
                console.log("WS /topic/items:", message.body);
                try {
                    const event = JSON.parse(message.body) as AuctionUpdateEvent;
                    setLastEvent(event);
                    updateCache(queryClient, event);
                    console.log("WS parsed:", event);
                } catch (e) {
                    console.error("WS parse error:", e);
                }
            })
        };
        client.onWebSocketClose = () => setConnected(false);
        client.onStompError = (frame) => {
            console.error("STOMP error:", frame.headers["message"]);
            console.error("Details:", frame.body);
        };

        client.onWebSocketError = (e) => {
            console.error("WebSocket error:", e);
        };

        client.activate();
        return () => {
            client.deactivate();
        }
    }, []);
    return {connected, lastEvent};
}