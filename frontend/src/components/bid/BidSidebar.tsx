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
    return <div className=" p-4">
        <p className="text-sm text-brand font-medium">
            You are the seller of this auction
        </p>
        <p className="text-xs text-black mt-1">
            You cannot place bids on your own listing.
        </p>
    </div>
}


export function BidSidebar({data, auctionId}: BidSidebarProps) {
    const {data: bidsData, isLoading} = useBids(auctionId);
    const {user} = useAuth();
    const queryClient = useQueryClient();

    const isOwner = data.sellerId === user?.id;

    // const latestBidValue = bidsData?.entries?.[0]?.amount ?? data.currentBid;

    
    // 2. Parse it into a usable number for your math
    const currentBidNumeric = useMemo(
        () => parseCurrency(data.currentBid),
        [data.currentBid] // React will recalculate when latestBidValue changes
    );


    //////////////////////////

    // const currentBidNumeric = useMemo(
    //     () => parseCurrency(data.currentBid),
    //     [data.currentBid]
    // );

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



