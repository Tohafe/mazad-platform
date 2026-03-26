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
        Instant endsAfter,
        String priceSort
) {
    public ItemSearch() {
        this(null, null, null, null,null, null, null, null, null);
    }

    public static ItemSearch withSellerId(UUID sellerId, ItemSearch other) {
        return ItemSearch.builder()
                .sellerId(sellerId)
                .categoryId(other.categoryId)
                .keyword(other.keyword)
                .status(other.status)
                .minPrice(other.minPrice)
                .maxPrice(other.maxPrice)
                .endsBefore(other.endsBefore)
                .endsAfter(other.endsAfter)
                .priceSort(other.priceSort)
                .build();
    }
}
