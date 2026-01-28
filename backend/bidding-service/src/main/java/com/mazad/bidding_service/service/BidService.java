package com.mazad.bidding_service.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.mazad.bidding_service.domain.Auction;
import com.mazad.bidding_service.domain.Bid;
import com.mazad.bidding_service.exception.AuctionClosedException;
import com.mazad.bidding_service.exception.AuctionNotFoundException;
import com.mazad.bidding_service.exception.InvalidBidAmountException;
import com.mazad.bidding_service.repository.AuctionRepository;
import com.mazad.bidding_service.repository.BidRepository;

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

        if (!auction.isOpen()) {
            throw new AuctionClosedException();
        }

        if (amount.compareTo(auction.getCurrentPrice()) <= 0) {
            throw new InvalidBidAmountException();
        }

        Bid bid = new Bid();
        bid.setAmount(amount);
        bid.setUserId(userId);
        bid.setAuction(auction);
        bid.setCreatedAt(LocalDateTime.now());

        auction.setCurrentPrice(amount);

        // bidRepository.save(bid);
        // auctionRepository.save(auction);

        return bid;
    }
}

