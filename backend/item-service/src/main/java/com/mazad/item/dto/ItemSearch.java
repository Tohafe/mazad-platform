package com.mazad.item.dto;

import java.math.BigDecimal;
import java.util.UUID;
import java.time.Instant;
import com.mazad.item.entity.AuctionStatus;

public record ItemSearch(
    UUID sellerId,
    Long categoryId,
    String title,
    String description,
    AuctionStatus status,
    BigDecimal startingPrice,
    BigDecimal currentBid,
    Instant startsAt,
    Instant endsAt
) {
    public ItemSearch() {
        this(null, null, null, null, null, null, null, null, null);
    }
}
