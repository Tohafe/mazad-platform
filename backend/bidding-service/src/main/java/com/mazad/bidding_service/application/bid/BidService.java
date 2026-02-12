package com.mazad.bidding_service.application.bid;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.mazad.bidding_service.infrastructure.kafka.AuctionUpdateProducer;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class BidService {

    private static final int EXTENSION_TRIGGER_SECONDS = 30;
    private static final int EXTENSION_DURATION_MINUTES = 1;

    private final BidRepository bidRepository;
    private final AuctionRepository auctionRepository;
    private final AuctionUpdateProducer auctionUpdateProducer;

    @Transactional
    public BidResponse placeBid(Long auctionId, UUID userId, Long amount) {

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException());

        BidValidator.validate(auction, amount);

        // Anti-Sniping Check
        extendAuctionIfNecessary(auction);

        Bid bid = new Bid();
        bid.setAmount(amount);
        bid.setBidderId(userId);
        bid.setAuction(auction);

        auction.setCurrentHighestBid(amount);
        auction.setCurrentHighestBidderId(userId);

        bidRepository.save(bid);
        auctionRepository.save(auction);

        BidResponse bidRes = new BidResponse();
        bidRes.setId(bid.getId());
        bidRes.setUserId(bid.getBidderId());
        bidRes.setAmount(bid.getAmount());
        bidRes.setCreatedAt(bid.getCreatedAt());

        // Trigger the Kafka event
        auctionUpdateProducer.sendUpdate(auction);

        return bidRes;
    }

    private void extendAuctionIfNecessary(Auction auction) {
        Instant now = Instant.now();
        Instant cutoff = auction.getEndsAt().minusSeconds(EXTENSION_TRIGGER_SECONDS);

        // If 'now' is after the cutoff (meaning we are in the last 30s)
        if (now.isAfter(cutoff)) {
            Instant newEndDate = auction.getEndsAt().plusSeconds(EXTENSION_DURATION_MINUTES * 60);
            auction.setEndsAt(newEndDate);

            log.info("Auction {} extended. New end date: {}", auction.getAuctionId(), newEndDate);
        }
    }
}

