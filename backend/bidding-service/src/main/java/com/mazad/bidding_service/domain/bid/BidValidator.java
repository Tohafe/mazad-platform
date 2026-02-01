package com.mazad.bidding_service.domain.bid;

import java.math.BigDecimal;

import com.mazad.bidding_service.domain.auction.Auction;
import com.mazad.bidding_service.domain.auction.AuctionStatus;
import com.mazad.bidding_service.domain.exception.AuctionClosedException;
import com.mazad.bidding_service.domain.exception.InvalidBidAmountException;

public class BidValidator {

    public static void validate(Auction auction, BigDecimal amount) {
        
        if (auction.getStatus() == AuctionStatus.CLOSED) {
            throw new AuctionClosedException();
        }

        if (amount.compareTo(auction.getCurrentHighestBid()) <= 0) {
            throw new InvalidBidAmountException();
        }

    }

}
