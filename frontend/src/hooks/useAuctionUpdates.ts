// import {useEffect, useMemo, useState} from "react";
// import type {AuctionUpdateEvent} from "../types/auctionUpdateEvent.ts";
// import {Client, type IMessage} from "@stomp/stompjs";
//
//
// type UseAuctionUpdatesOptions = {
//     brokerURL?: string,
//     debug?: boolean
// }
//
//
// export function useAuctionUpdates(
//     auctionId: number | null,
//     options: UseAuctionUpdatesOptions = {},
// ) {
//     const [lastEvent, setLastEvent] = useState<AuctionUpdateEvent | null>(null);
//     const [connected, setConnected] = useState(false);
//
//     const brokerURL = options.brokerURL ?? "ws://localhost:8000/ws";
//     const debug = options.debug ?? false;
//
//     const topic = useMemo(() => {
//         if (!auctionId) return null;
//         return `/topic/items/${auctionId}`;
//     }, [auctionId])
//
//     useEffect(() => {
//         if (!topic) return;
//
//         const client = new Client({
//             brokerURL,
//             reconnectDelay: 2000,
//             debug: debug ? (s) => console.log("[stomp]", s) : undefined
//         })
//         client.onConnect = () => {
//             setConnected(true);
//             client.subscribe(topic, (message: IMessage)=> {
//                 try {
//                     const event = JSON.parse(message.body) as AuctionUpdateEvent;
//                     setLastEvent(event);
//                 } catch (e) {
//                     console.error("Failed to parse AuctionUpdateEvent:", e, message.body);
//                 }
//             })
//         }
//         client.onWebSocketClose = () => setConnected(false);
//         client.onStompError = (frame) => {
//             console.error("STOMP error:", frame.headers["message"]);
//             console.error("Details:", frame.body);
//         }
//         client.onWebSocketError = (e) => console.error("WebSocket error:", e);
//         client.activate();
//
//         return () => {
//             client.deactivate();
//         }
//     }, [topic, brokerURL, debug])
//
//     return {connected, lastEvent};
// }