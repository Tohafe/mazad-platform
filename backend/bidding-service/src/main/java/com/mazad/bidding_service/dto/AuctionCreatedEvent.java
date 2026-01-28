package com.mazad.bidding_service.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuctionCreatedEvent {

    private Long id;

    private boolean status;
    
    private BigDecimal startingPrice;
}
