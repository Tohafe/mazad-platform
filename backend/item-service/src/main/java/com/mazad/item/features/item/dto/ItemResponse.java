package com.mazad.item.features.item.dto;

import com.mazad.item.features.item.entity.AuctionStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record ItemResponse(
        Long id,
        Long sellerId,
        String title,
        String description,
        AuctionStatus status,
        BigDecimal startingPrice,
        BigDecimal currentBid,
        Instant startsAt,
        Instant endsAt
) {
}
