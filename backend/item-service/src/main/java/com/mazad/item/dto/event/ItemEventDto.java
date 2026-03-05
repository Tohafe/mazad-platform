package com.mazad.item.dto.event;

import com.mazad.item.entity.AuctionStatus;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record ItemEventDto(
        Long id,
        UUID sellerId,
        AuctionStatus status,
        Long startingPrice,
        Instant endsAt
) {
}
