package com.mazad.item.dto;

import java.math.BigDecimal;
import java.util.UUID;
import java.time.Instant;
import com.mazad.item.entity.AuctionStatus;
import lombok.Builder;

@Builder
public record ItemSearch(
    UUID sellerId,
    Long categoryId,
    String keyword,
    AuctionStatus status,
    BigDecimal minPrice,
    BigDecimal maxPrice,
    Instant endsBefore
) {
    public ItemSearch() {
        this(null, null, null, null, null, null, null);
    }
}
