import {useMemo} from 'react';
import type {BidData} from '../../types';
import {useBids} from '../../hooks/useBids';
import {CountdownTimer} from './CountdownTimer';
import {CurrentBid} from './CurrentBid';
import {SellerRow} from './SellerRow';
import {QuickBidButtons} from './QuickBidButtons';
import {BidInput} from './BidInput';
import {ActionButtons} from './ActionButtons';
import {BidHistory} from './BidHistory';
import {HelpBox} from './HelpBox';
import {ClosedAuctionView} from './ClosedAuctionView';
import {usePlaceBid} from "../../hooks/usePlaceBid.ts";
import {useAuth} from "../../context/AuthProvider.tsx";
import { useQueryClient } from '@tanstack/react-query';

interface BidSidebarProps {
    data: BidData;
    auctionId: number;
}

export function isAuctionClosed(status: string) {
    return ["SOLD", "EXPIRED", "CANCELLED", "CLOSED"].includes(status);
}

export function parseCurrency(value: string): number {
    return parseFloat(value.replace(/[^\d.]/g, ""));
}

const AuctionOwner = () => {
    return <div className="text-center p-4 rounded-md">
    <p className="text-sm font-bold text-brand">
        You are the seller of this auction
    </p>
    <p className="text-xs mt-1">
        You cannot place bids on your own listing.
    </p>
    </div>
}


export function BidSidebar({data, auctionId}: BidSidebarProps) {
    const {user} = useAuth();
    const {data: bidsData, isLoading} = useBids(auctionId, user);
    const queryClient = useQueryClient();

    const isOwner = data.sellerId === user?.id;

    // 2. NEW: Calculate if the current user is the last/winning bidder
    // We grab the first bid (the highest/latest) and check if it belongs to the user
    const winningBid = bidsData?.entries?.[0];

    // Assuming you added 'isOwnBid' to your BidEntry object in transformBid
    // If not, you can temporarily use: winningBid?.pseudonym === "Your bid"
    const isWinner = winningBid?.pseudonym === "Your bid"

    // const latestBidValue = bidsData?.entries?.[0]?.amount ?? data.currentBid;

    
    // 2. Parse it into a usable number for your math
    const currentBidNumeric = useMemo(
        () => parseCurrency(data.currentBid),
        [data.currentBid] // React will recalculate when latestBidValue changes
    );


    const minRequired = useMemo(
        () => currentBidNumeric + 1,
        [currentBidNumeric]
    );

    const {
        bidValue,
        setBidValue,
        error,
        success,
        isPending,
        submitBid,
        quickBid,
    } = usePlaceBid(auctionId, minRequired);

    if (isAuctionClosed(data.status)) {
        void queryClient.invalidateQueries({ queryKey: ['product', auctionId] });
        return (
            <div className="space-y-4 w-full max-w-100">
                <ClosedAuctionView
                    status={data.status}
                    finalBid={data.currentBid}
                    sellerId={data.sellerId}
                    bids={bidsData?.entries ?? []}
                    totalBids={bidsData?.total ?? 0}
                    isLoading={isLoading}
                    isOwner={isOwner}   // 👈 3. Pass the owner flag
                    isWinner={isWinner}
                />
                <HelpBox/>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white border border-border overflow-hidden">

                <CountdownTimer
                    endTime={data.endTime}
                    startsAt={data.startsAt}
                    endsAt={data.endsAt}
                />

                {/* Content Area */}
                <div className="px-4 py-5">

                    <CurrentBid amount={data.currentBid} startingPrice={data.startingPrice}/>

                    <div className="mt-4">
                        <SellerRow sellerId={data.sellerId}/>
                    </div>

                    {!isOwner ? <div>
                        <QuickBidButtons amounts={data.quickBidAmounts} onBidClick={quickBid}/>

                        <BidInput
                            minBid={data.minBid}
                            currentBidNumeric={currentBidNumeric}
                            value={bidValue}
                            onChange={setBidValue}
                            error={error}
                        />

                        {success && (
                            <p className="text-xs text-success mb-2 px-1">{success}</p>
                        )}

                        <ActionButtons
                            onPlaceBid={submitBid}
                            isLoading={isPending}
                        />

                    </div> : <AuctionOwner/>}

                    <BidHistory
                        bids={bidsData?.entries ?? []}
                        totalBids={bidsData?.total ?? 0}
                        isLoading={isLoading}
                    />

                </div>
            </div>

            <HelpBox/>
        </div>
    );
}



