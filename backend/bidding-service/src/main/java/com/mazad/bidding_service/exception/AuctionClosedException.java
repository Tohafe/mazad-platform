package com.mazad.bidding_service.exception;

public class AuctionClosedException extends RuntimeException {
    public AuctionClosedException() {
        super("Auction is closed");
    }
}

