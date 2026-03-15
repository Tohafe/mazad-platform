package com.mazad.bidding_service.domain.auction;

public enum AuctionStatus {
    ACTIVE, // bidding is open.
    CLOSED, //close bidding when we reach the end date.
    CANCELLED // auction canceled by the seller.
}
