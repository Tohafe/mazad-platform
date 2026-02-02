package com.mazad.bidding_service.application.bid;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.mazad.bidding_service.domain.auction.Auction;
import com.mazad.bidding_service.domain.auction.AuctionRepository;
import com.mazad.bidding_service.domain.bid.Bid;
import com.mazad.bidding_service.domain.bid.BidRepository;
import com.mazad.bidding_service.domain.bid.BidValidator;
import com.mazad.bidding_service.domain.exception.AuctionNotFoundException;
import com.mazad.bidding_service.web.dto.BidResponse;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;

    @Transactional
    public BidResponse placeBid(Long auctionId, Long userId, BigDecimal amount) {

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

        BidResponse bidRes = new BidResponse();
        bidRes.setId(bid.getId());
        bidRes.setUserId(bid.getBidderId());
        bidRes.setAmount(bid.getAmount());
        bidRes.setCreatedAt(bid.getCreatedAt());

        return bidRes;
    }
}

