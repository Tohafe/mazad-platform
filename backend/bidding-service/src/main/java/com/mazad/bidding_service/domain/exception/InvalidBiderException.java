package com.mazad.bidding_service.domain.exception;

public class InvalidBiderException extends RuntimeException {
    public InvalidBiderException() {
        super("As a Seller you can not bid on your own items!");
    }
}
