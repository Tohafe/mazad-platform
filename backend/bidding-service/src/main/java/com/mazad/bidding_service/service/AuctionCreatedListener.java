package com.mazad.bidding_service.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.mazad.bidding_service.domain.Auction;
import com.mazad.bidding_service.dto.AuctionCreatedEvent;
import com.mazad.bidding_service.repository.AuctionRepository;
import lombok.extern.slf4j.Slf4j;

import lombok.AllArgsConstructor;
import tools.jackson.databind.json.JsonMapper;

@AllArgsConstructor
@Component
@Slf4j
public class AuctionCreatedListener {

    private final AuctionRepository auctionRepository;

    private JsonMapper jsonMapper;

    @KafkaListener(topics = "item.created", groupId = "new-group")
    public void handleAuctionCreated(String event) {
        try {
            AuctionCreatedEvent auctionEvent = jsonMapper.readerFor(AuctionCreatedEvent.class).readValue(event);
            
            Auction auction = new Auction();
            auction.setId(auctionEvent.getId());
            auction.setOpen(auctionEvent.isStatus());
            auction.setCurrentPrice(auctionEvent.getStartingPrice());

            log.info("Item creation event received: {}", event);
            // auctionRepository.save(auction);
            
        } catch (Exception e) {
            log.error("Failed to parse event: {}", event, e);
        }
    }
}
