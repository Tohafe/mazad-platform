package com.mazad.item.dto;

import com.mazad.item.entity.AuctionStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Builder
public record ItemDetailsDto(
        Long id,
        Long categoryId,
        UUID sellerId,
        String title,
        String description,
        AuctionStatus status,
        List<String> images,
        Map<String, String> specs,
        String shippingInfo,
        BigDecimal startingPrice,
        BigDecimal currentBid,
        Instant startsAt,
        Instant endsAt,
        Instant createdAt,
        Instant updatedAt
) {
}
