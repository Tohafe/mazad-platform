import { useQuery } from '@tanstack/react-query';
import { bidApi } from '../api';
import type { ApiBid, BidEntry } from '../types';
import { generatePseudonym } from '../utils';

/** Format "€ 123.00" */
function formatCurrency(amount: number): string {
  return `€ ${amount.toFixed(2)}`;
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
function transformBid(bid: ApiBid): BidEntry {
  return {
    pseudonym: generatePseudonym(bid.bidderId),
    timeAgo: timeAgo(bid.createdAt),
    amount: formatCurrency(bid.amount),
  };
}

export function useBids(auctionId: number) {
  return useQuery({
    queryKey: ['bids', auctionId],
    queryFn: () => bidApi.getBids(auctionId),
    select: (data: ApiBid[]): { entries: BidEntry[]; total: number } => {
      const sorted = [...(data ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      return {
        entries: sorted.map(transformBid),
        total: sorted.length,
      };
    },
    // Re-fetch every 10 s so new bids appear without full page reload
    refetchInterval: 10_000,
  });
}
