package com.mazad.item.dto;

import com.mazad.item.entity.AuctionStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ItemResponse(
        Long id,
        Long categoryId,
        UUID sellerId,
        String title,
        String description,
        AuctionStatus status,
        BigDecimal startingPrice,
        BigDecimal currentBid,
        Instant startsAt,
        Instant endsAt
) {
}
