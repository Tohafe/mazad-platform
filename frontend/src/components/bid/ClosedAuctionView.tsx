import { useState } from 'react';
import type { BidEntry, AuctionStatus } from '../../types';
import {BiChevronDown, BiChevronUp} from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { PiChatDots } from "react-icons/pi";
import Button from '../Button/Button.tsx';
import { SellerRow } from './SellerRow.tsx';

interface ClosedAuctionViewProps {
  status: AuctionStatus;
  finalBid: string;
  sellerId: string;
  bids: BidEntry[];
  totalBids: number;
  isLoading?: boolean;
  isOwner: boolean;
  isWinner: boolean;
  winnerId: string | null | undefined
}

// Status display configuration
const STATUS_CONFIG: Record<'SOLD' | 'EXPIRED' | 'CANCELLED', { label: string; color: string; badge: string; badgeColor: string }> = {
  SOLD: {
    label: 'Final Bid',
    color: 'text-blue-600',
    badge: 'Sold',
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

interface CongratulationsProps {
  isOwner: boolean;
  isWinner: boolean;
  sellerId: string;
  winnerId: string | null | undefined
}

let contact: string;
let userId: string | null | undefined;

export const Congratulations = ({ isOwner, isWinner, sellerId, winnerId }: CongratulationsProps) => {
  const navigate = useNavigate();
  // If they are just a regular user who lost or is browsing, render nothing.
  if ((!isOwner && !isWinner) || !winnerId) {
    return null; 
  }
  
  if(isOwner) {
    userId = winnerId;
    contact = "Message Winner";
  }
  else if (isWinner) {
    userId = sellerId;
    contact = "Contact Seller";
  }
  // If the code reaches here, we know they are EITHER the owner OR the winner.
  return (
    <div className="text-center p-4 rounded-md">
      <p className="text-sm font-bold text-brand">
        {isOwner 
          ? "Congratulations on your successful sale!" 
          : "Congratulations on your winning bid!"}
      </p>
      <p className="text-xs mt-1">
        {isOwner
          ? "Get in touch with the buyer to finalize the transaction."
          : "Get in touch with the seller to finalize your purchase."}
      </p>
      {winnerId &&
          <Button className="mt-4"  iconPos="left" variant={"secondary"} icon={PiChatDots}
           iconClassName="size-5" size={"sm"} onClick={() => navigate(`/inbox/${userId}`)}>{contact}</Button>}
    </div>
  );
};

export function ClosedAuctionView({
  status,
  finalBid,
  sellerId,
  bids,
  totalBids,
  isLoading,
  isOwner,
  isWinner,
  winnerId

}: ClosedAuctionViewProps) {
  const [expanded, setExpanded] = useState(false);
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
        <SellerRow sellerId={sellerId} variant='detailed'/>

        {(
          <div className="border-t border-gray-100">
            <Congratulations isOwner={isOwner} isWinner={isWinner} sellerId={sellerId} winnerId={winnerId}/>
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
