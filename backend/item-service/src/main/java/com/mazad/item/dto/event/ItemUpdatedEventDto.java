package com.mazad.item.dto.event;

import com.mazad.item.entity.AuctionStatus;

import java.time.Instant;
import java.util.UUID;

public record ItemUpdatedEventDto(
        Long auctionId,
        Long currentHighestBid,
        Instant endsAt,
        AuctionStatus status,
        UUID lastBidderId
) {}
