package com.mazad.bidding_service.infrastructure.kafka;

import java.time.Instant;
import java.util.UUID;

import com.mazad.bidding_service.domain.auction.AuctionStatus;

public record AuctionUpdateEvent(
        Long auctionId,
        Long currentHighestBid,
        Instant endsAt,
        AuctionStatus status,
        UUID sellerId,
        UUID lastBidderId,
        UUID previousBidderId,
        Long previousBidderIdAvailableBalance,
        Long lastBidderAvailableBalance,
        Long sellerAvailableBalance
) {}