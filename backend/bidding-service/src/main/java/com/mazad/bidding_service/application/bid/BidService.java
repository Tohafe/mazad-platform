package com.mazad.bidding_service.application.bid;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.mazad.bidding_service.domain.auction.Auction;
import com.mazad.bidding_service.domain.auction.AuctionRepository;
import com.mazad.bidding_service.domain.bid.Bid;
import com.mazad.bidding_service.domain.bid.BidRepository;
import com.mazad.bidding_service.domain.bid.BidValidator;
import com.mazad.bidding_service.domain.exception.AuctionNotFoundException;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;

    public BidService(BidRepository bidRepository,
                      AuctionRepository auctionRepository) {
        this.bidRepository = bidRepository;
        this.auctionRepository = auctionRepository;
    }

    public Bid placeBid(Long auctionId, Long userId, BigDecimal amount) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException());

        BidValidator.validate(auction, amount);

        Bid bid = new Bid();
        bid.setAmount(amount);
        bid.setBidderId(userId);
        bid.setAuction(auction);

        auction.setCurrentHighestBid(amount);

        bidRepository.save(bid);
        auctionRepository.save(auction);

        return bid;
    }
}

