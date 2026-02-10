package com.mazad.bidding_service.domain.exception;

public class AuctionClosedException extends RuntimeException {
    public AuctionClosedException() {
        super("Auction is closed");
    }
}

