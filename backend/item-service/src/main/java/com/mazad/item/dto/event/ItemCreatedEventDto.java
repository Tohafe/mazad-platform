package com.mazad.item.dto.event;

import com.mazad.item.entity.AuctionStatus;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
public record ItemCreatedEventDto(
        Long id,
        AuctionStatus status,
        Long startingPrice,
        Instant endsAt
) {
}
