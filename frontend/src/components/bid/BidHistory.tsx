import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { BidEntry } from '../../types';

interface BidHistoryProps {
  bids: BidEntry[];
  totalBids: number;
  isLoading?: boolean;
}

const VISIBLE_COUNT = 3;

export function BidHistory({ bids, totalBids, isLoading }: BidHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="py-3 text-center">
        <span className="text-sm text-gray-400">Loading bids…</span>
      </div>
    );
  }

  // No bids at all
  if (!bids?.length) {
    return (
      <div className="py-3 text-center">
        <span className="text-sm text-gray-400">No bids placed</span>
      </div>
    );
  }

  const visibleBids = expanded ? bids : bids.slice(0, VISIBLE_COUNT);
  const hasMore = totalBids > VISIBLE_COUNT;
  const shouldScroll = expanded && bids.length > 20;

  return (
    <>
      <div className={`space-y-2 mb-3 ${shouldScroll ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
        {visibleBids.map((bid, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">{bid.pseudonym}</span>
              <span className="text-gray-400 text-xs">{bid.timeAgo}</span>
            </div>
            <span className="font-medium text-gray-900">{bid.amount}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-5"
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              See all bids ({totalBids})
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </>
  );
}

