package com.mazad.item.dto;

import java.math.BigDecimal;
import java.util.Map;
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
    Long minPrice,
    Long maxPrice,
    Instant endsBefore,
    Instant endsAfter
) {
    public ItemSearch() {
        this(null, null, null, null, null, null, null, null);
    }
}
