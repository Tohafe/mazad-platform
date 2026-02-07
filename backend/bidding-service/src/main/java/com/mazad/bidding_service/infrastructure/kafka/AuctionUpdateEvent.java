package com.mazad.bidding_service.infrastructure.kafka;

import java.math.BigDecimal;
import java.time.Instant;

import com.mazad.bidding_service.domain.auction.AuctionStatus;

public record AuctionUpdateEvent(
        Long auctionId,
        BigDecimal currentHighestBid,
        Instant endsAt,
        AuctionStatus status,
        Long lastBidderId
) {}