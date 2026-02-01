package com.mazad.bidding_service.domain.exception;

public class AuctionNotFoundException extends RuntimeException {
    public AuctionNotFoundException() {
        super("Auction not found");
    }
}

