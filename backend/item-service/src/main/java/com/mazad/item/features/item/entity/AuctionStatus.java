package com.mazad.item.features.item.entity;

public enum AuctionStatus {
    DRAFT, // the seller is editing the item.
    ACTIVE, // bidding is open.
    SOLD, // auction ended with a winner
    EXPIRED, // auction ended with no bids.
    CANCELLED // auction canceled by the seller.
}
