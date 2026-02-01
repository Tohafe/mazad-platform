package com.mazad.bidding_service.web.dto;

import java.math.BigDecimal;

import com.mazad.bidding_service.domain.auction.AuctionStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuctionCreatedEvent {

    private Long id;

    private AuctionStatus status;
    
    private BigDecimal startingPrice;
}
