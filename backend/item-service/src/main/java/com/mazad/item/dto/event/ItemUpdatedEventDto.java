package com.mazad.item.dto.event;

import com.mazad.item.entity.AuctionStatus;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record ItemUpdatedEventDto(
        Long auctionId,
        Long currentHighestBid,
        Instant endsAt,
        AuctionStatus status,
        UUID lastBidderId
) {}
