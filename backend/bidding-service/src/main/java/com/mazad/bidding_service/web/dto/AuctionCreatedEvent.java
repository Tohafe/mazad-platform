package com.mazad.bidding_service.web.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.mazad.bidding_service.domain.auction.AuctionStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuctionCreatedEvent {

    @NotNull
    private Long id;

    @NotNull
    private AuctionStatus status;
    
    @NotNull
    private Long startingPrice;

    @NotNull
    private Instant endsAt;
}
