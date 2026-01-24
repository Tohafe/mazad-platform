package com.mazad.bidding_service.exception;

public class InvalidBidAmountException extends RuntimeException {
    public InvalidBidAmountException() {
        super("Bid must be higher than current price");
    }
}

