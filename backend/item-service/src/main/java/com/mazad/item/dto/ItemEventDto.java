package com.mazad.item.dto;

import com.mazad.item.entity.AuctionStatus;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record ItemEventDto(
        Long id,
        AuctionStatus status,
        BigDecimal startingPrice
) {
}
