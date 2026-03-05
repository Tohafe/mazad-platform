import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { BidData } from '../../types';
import { useBidApi } from '../../hooks/useBidApi';
import { useBids } from '../../hooks/useBids';
import { CountdownTimer } from './CountdownTimer';
import { CurrentBid } from './CurrentBid';
import { ExpertRow } from './ExpertRow';
import { QuickBidButtons } from './QuickBidButtons';
import { BidInput, parseBidValue } from './BidInput';
import { ActionButtons } from './ActionButtons';
import { WatchingBar } from './WatchingBar';
import { BidHistory } from './BidHistory';
import { InfoRows } from './InfoRows';
import { PaymentOptions } from './PaymentOptions';
import { BuyerProtection } from './BuyerProtection';
import { TrustpilotRow } from './TrustpilotRow';
import { HelpBox } from './HelpBox';
import { ClosedAuctionView } from './ClosedAuctionView';

interface BidSidebarProps {
  data: BidData;
  auctionId: number;
}

export function BidSidebar({ data, auctionId }: BidSidebarProps) {
  const [bidValue, setBidValue] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const bidApi = useBidApi();

  // Fetch bids for this auction
  const { data: bidsData, isLoading: bidsLoading } = useBids(auctionId);

  // Parse currentBid string ("€ 123.00") → number
  const currentBidNumeric = parseFloat(
    data.currentBid.replace(/[^0-9.,]/g, '').replace(',', '.')
  ) || 0;
  const minRequired = currentBidNumeric + 1;

  const { mutate: placeBid, isPending } = useMutation({
    mutationFn: (amount: number) =>
      bidApi.placeBid({ auctionId, amount }),
    onSuccess: () => {
      setApiError(null);
      setSuccessMsg('Bid placed successfully!');
      setBidValue('');
      // Refetch product and bids to get updated data "Naoufal"
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (err: any) => {
      setSuccessMsg(null);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to place bid. Please try again.';
      setApiError(msg);
    },
  });

  const handlePlaceBid = useCallback(() => {
    setApiError(null);
    setSuccessMsg(null);
    const amount = parseBidValue(bidValue);
    if (amount < minRequired) {
      setApiError(`Minimum bid is ${minRequired}`);
      return;
    }
    placeBid(amount);
  }, [bidValue, minRequired, placeBid]);

  const handleQuickBid = useCallback((amountStr: string) => {
    // Quick bid buttons already show valid amounts → place immediately
    setApiError(null);
    setSuccessMsg(null);
    const amount = parseBidValue(amountStr);
    setBidValue(String(amount));
    placeBid(amount);
  }, [placeBid]);

    // Show closed auction view when auction has ended
  const isAuctionClosed = data.status === 'SOLD' || data.status === 'EXPIRED' || data.status === 'CANCELLED';
  
  if (isAuctionClosed) {
    return (
      <div className="space-y-4 w-full lg:max-w-xs">
        <ClosedAuctionView
          status={data.status}
          finalBid={data.currentBid}
          curator={data.curator}
          bids={bidsData?.entries ?? []}
          totalBids={bidsData?.total ?? 0}
          isLoading={bidsLoading}
        />
        <HelpBox />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full lg:max-w-xs">
      {/* ========== MAIN CARD - ONE CONTINUOUS SECTION ========== */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        
        <CountdownTimer 
          endTime={data.endTime}
          startsAt={data.startsAt}
          endsAt={data.endsAt}
        />

        {/* Content Area */}
        <div className="px-4 py-5">
          
          <CurrentBid amount={data.currentBid} startingPrice={data.startingPrice} />
          
          <div className="mt-4">
            <ExpertRow curator={data.curator} />
          </div>

          <QuickBidButtons amounts={data.quickBidAmounts} onBidClick={handleQuickBid} />

          <BidInput
            minBid={data.minBid}
            currentBidNumeric={currentBidNumeric}
            value={bidValue}
            onChange={setBidValue}
            error={apiError}
          />

          {successMsg && (
            <p className="text-xs text-green-600 mb-2 px-1">{successMsg}</p>
          )}

          <ActionButtons
            onPlaceBid={handlePlaceBid}
            isLoading={isPending}
          />

          <WatchingBar count={data.watchingCount} />

          <BidHistory 
            bids={bidsData?.entries ?? []} 
            totalBids={bidsData?.total ?? 0}
            isLoading={bidsLoading}
          />

          <InfoRows 
            buyerProtectionFee={data.buyerProtectionFee}
            shippingLocation={data.shippingLocation}
          />

          <PaymentOptions />

          <BuyerProtection />

          <TrustpilotRow 
            rating={data.trustpilotRating}
            reviewCount={data.trustpilotReviews}
          />
        </div>
      </div>

      {/* ========== SEPARATE BOTTOM BOX ========== */}
      <HelpBox />
    </div>
  );
}
