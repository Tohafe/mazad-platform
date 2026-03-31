import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { IMessage } from '@stomp/stompjs';
import type { ApiBid, BidEntry, ApiProduct, AuctionStatus } from '../types';
import { useBidApi } from './useBidApi';
import { generatePseudonym } from '../utils';
import { useWebSocket } from '../context/WebSocketContext';
import {formatPrice} from "../utils/currency.ts";
// import { useAuth } from '../context/AuthProvider.tsx';@Naoufal
import type User from '../types/user.ts';

/** WebSocket bid event message structure */
interface BidEventMessage extends ApiBid {
  endsAt?: string;
  status?: AuctionStatus;
  currentHighestBid: number
}


/** Relative time label, e.g. "2 min ago", "1 hour ago" */
function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/** Transform a raw API bid into a display entry */
function transformBid(bid: ApiBid, currentUserId?: string | null): BidEntry {

  const isUser = bid.bidderId === currentUserId;
  console.log('inside Transform:', isUser);
  console.log('inside Transform:', formatPrice(bid.amount));
  return {
    pseudonym: (isUser ? "Your bid" : generatePseudonym(bid.bidderId)),
    timeAgo: timeAgo(bid.createdAt),
    amount: formatPrice(bid.amount),
  };
}

export function useBids(auctionId: number, user: User | null ) {
  const { stompClient, isConnected } = useWebSocket();
  const queryClient = useQueryClient();
  const { getBids } = useBidApi();

  // const { user } = useAuth();

  console.log('Naoufal New bid received: 0');

  // Subscribe to real-time bid updates via WebSocket
  useEffect(() => {
    if (!stompClient || !isConnected || !auctionId) return;

    const subscription = stompClient.subscribe(`/topic/auction/${auctionId}`, (message: IMessage) => {
      try {
        const bidEvent = JSON.parse(message.body) as BidEventMessage;
        
        // Update the bids cache with the new bid
        queryClient.setQueryData<ApiBid[]>(['bids', auctionId], (oldBids) => {
          if (!oldBids) return [bidEvent];

          // Add new bid if it doesn't already exist
          const exists = oldBids.some((bid) => bid.id === bidEvent.id);
          if (exists) return oldBids;
          return [bidEvent, ...oldBids];
        });

        // Update the product cache with the new bid amount and endsAt if provided
        queryClient.setQueryData<ApiProduct>(['product', auctionId], (oldProduct) => {
          if (!oldProduct) return oldProduct;
          return {
            ...oldProduct,
            currentBid: bidEvent.currentHighestBid,
            ...(bidEvent.endsAt && { endsAt: bidEvent.endsAt }),
            ...(bidEvent.status && { status: bidEvent.status }),
          };
        });        
      } catch (error) {
      }

      // Invalidate queries to ensure components re-render with updated data
      void queryClient.invalidateQueries({ queryKey: ['bids', auctionId] });
      // void queryClient.invalidateQueries({ queryKey: ['product', auctionId] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [stompClient, isConnected, auctionId, queryClient]);

  return useQuery({
    queryKey: ['bids', auctionId],
    queryFn: () => getBids(auctionId),
    select: (data: ApiBid[]): { entries: BidEntry[]; total: number } => {
      const sorted = [...(data ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      return {
        entries: sorted.map((bid) => transformBid(bid, user?.id)),
        total: sorted.length,
      };
    },
  });
}
