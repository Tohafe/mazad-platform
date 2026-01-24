package com.mazad.bidding_service.exception;

public class AuctionNotFoundException extends RuntimeException {
    public AuctionNotFoundException() {
        super("Auction not found");
    }
}

