package com.mazad.bidding_service.infrastructure.kafka;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.mazad.bidding_service.domain.auction.Auction;
import com.mazad.bidding_service.domain.auction.AuctionRepository;
import com.mazad.bidding_service.web.dto.AuctionCreatedEvent;

import lombok.extern.slf4j.Slf4j;

import lombok.AllArgsConstructor;
import tools.jackson.databind.json.JsonMapper;

@AllArgsConstructor
@Component
@Slf4j
public class AuctionOpenedConsumer {

    private final AuctionRepository auctionRepository;

    private JsonMapper jsonMapper;

    @KafkaListener(topics = "item.created", groupId = "new-group")
    public void handleAuctionCreated(String event) {

        Auction auction = new Auction();

        try {
            AuctionCreatedEvent auctionEvent = jsonMapper.readerFor(AuctionCreatedEvent.class)
                                                .readValue(event);

            auction.setAuctionId(auctionEvent.getId());
            auction.setStatus(auctionEvent.getStatus());
            auction.setStartingPrice(auctionEvent.getStartingPrice());
            auction.setCurrentHighestBid(auctionEvent.getStartingPrice());
            auction.setEndsAt(auctionEvent.getEndsAt());

            log.info("Item creation event received: {}", event);
            
        } catch (Exception e) {
            log.error("Failed to parse event: {}", event, e);
        }
        
        auctionRepository.save(auction);
    }
}
