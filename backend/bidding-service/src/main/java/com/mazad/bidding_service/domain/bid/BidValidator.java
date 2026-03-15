package com.mazad.bidding_service.domain.bid;
import java.util.UUID;
import com.mazad.bidding_service.domain.auction.Auction;
import com.mazad.bidding_service.domain.auction.AuctionStatus;
import com.mazad.bidding_service.domain.exception.AuctionClosedException;
import com.mazad.bidding_service.domain.exception.InvalidBidAmountException;
import com.mazad.bidding_service.domain.exception.InvalidBiderException;

public class BidValidator {

    public static void validate(Auction auction, Long amount, UUID userId) {
        
        if ( auction.getStatus() == AuctionStatus.CLOSED || auction.getStatus() == AuctionStatus.CANCELLED ) {
            throw new AuctionClosedException();
        }

        if ( amount.compareTo(auction.getCurrentHighestBid() ) <= 0) {
            throw new InvalidBidAmountException();
        }

        if ( auction.getSellerId().equals(userId) ) {
            throw new InvalidBiderException();
        }

    }

}
