import { useState } from 'react';
import type { BidEntry, AuctionStatus } from '../../types';
import { useSeller } from '../../hooks/useSeller';
import {BiChevronDown, BiChevronUp} from "react-icons/bi";
import {Link} from "react-router-dom";

interface ClosedAuctionViewProps {
  status: AuctionStatus;
  finalBid: string;
  sellerId: string;
  bids: BidEntry[];
  totalBids: number;
  isLoading?: boolean;
}

// Status display configuration
const STATUS_CONFIG: Record<'SOLD' | 'EXPIRED' | 'CANCELLED', { label: string; color: string; badge: string; badgeColor: string }> = {
  SOLD: {
    label: 'Final Bid',
    color: 'text-blue-600',
    badge: 'Balance',
    badgeColor: 'bg-green-100 text-green-700',
  },
  EXPIRED: {
    label: 'Final Bid',
    color: 'text-blue-600',
    badge: 'Expired',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
  CANCELLED: {
    label: 'Final Bid',
    color: 'text-blue-600',
    badge: 'Cancelled',
    badgeColor: 'bg-red-100 text-red-700',
  },
};

export function ClosedAuctionView({
  status,
  finalBid,
  sellerId,
  bids,
  totalBids,
  isLoading,
}: ClosedAuctionViewProps) {
  const [expanded, setExpanded] = useState(false);
  const { data: seller, isLoading: sellerLoading } = useSeller(sellerId);
  
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.SOLD;

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="px-4 py-5">
        {/* Final Bid Section */}
        <div className="mb-4">
          <p className={`text-xs uppercase tracking-wider ${config.color} font-medium mb-1`}>
            {config.label}
          </p>
          <p className="text-4xl font-bold text-gray-900">{finalBid}</p>
          <span className={`inline-block ${config.badgeColor} text-xs font-medium px-2.5 py-0.5 rounded-full mt-2`}>
            {config.badge}
          </span>
        </div>

        {/* Seller Row */}
        {sellerId && (
          <div className="flex items-center gap-3 py-3 border-t border-gray-100">
            {sellerLoading ? (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="relative">
                  <img
                    src={seller?.image || ''}
                    alt={seller?.name || 'Seller'}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/48x48/e5e7eb/9ca3af?text=?';
                    }}
                  />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                    Seller
                  </span>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
                >
                  Sold by <Link to={`/profile/${seller?.name}`}><span className="font-medium">{seller?.name || 'Unknown'}</span></Link>
                  <BiChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                </button>
              </>
            )}
          </div>
        )}

        {/* See all bids */}
        {totalBids > 0 && (
          <div className="pt-3 border-t border-gray-100">
            {isLoading ? (
              <span className="text-sm text-gray-400">Loading bids…</span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
                >
                  See all bids ({totalBids})
                  {expanded ? (
                    <BiChevronUp className="w-4 h-4" />
                  ) : (
                    <BiChevronDown className="w-4 h-4" />
                  )}
                </button>

                {expanded && bids.length > 0 && (
                  <div className={`mt-3 space-y-2 ${bids.length > 30 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
                    {bids.map((bid, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700 font-medium">{bid.pseudonym}</span>
                          <span className="text-gray-400 text-xs">{bid.timeAgo}</span>
                        </div>
                        <span className="font-medium text-gray-900">{bid.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
