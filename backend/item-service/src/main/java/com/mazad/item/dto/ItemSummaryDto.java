package com.mazad.item.dto;

import com.mazad.item.entity.AuctionStatus;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.Instant;

@Builder
public record ItemSummaryDto(
        Long id,
        String title,
        String thumbnail,
        BigDecimal currentBid,
        AuctionStatus status,
        Instant startsAt,
        Instant endsAt
) {
}
