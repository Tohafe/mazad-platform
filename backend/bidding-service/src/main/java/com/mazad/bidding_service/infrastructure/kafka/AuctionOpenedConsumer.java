package com.mazad.bidding_service.infrastructure.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.mazad.bidding_service.application.wallet.WalletService;
import com.mazad.bidding_service.domain.auction.Auction;
import com.mazad.bidding_service.domain.auction.AuctionRepository;
import com.mazad.bidding_service.domain.exception.AuctionNotFoundException;
import com.mazad.bidding_service.web.dto.AuctionCreatedEvent;
import com.mazad.bidding_service.web.dto.WalletDto;

import lombok.extern.slf4j.Slf4j;

import lombok.AllArgsConstructor;
import tools.jackson.databind.json.JsonMapper;

@AllArgsConstructor
@Component
@Slf4j
public class AuctionOpenedConsumer {

    private final AuctionRepository auctionRepository;
    private final WalletService walletService;

    private JsonMapper jsonMapper;

    @KafkaListener(topics = "${item.created.topic}", groupId = "bidder")
    public void handleAuctionCreated(String event) {

        Auction auction = new Auction();

        try {
            AuctionCreatedEvent auctionEvent = jsonMapper.readerFor(AuctionCreatedEvent.class)
                                                .readValue(event);

            auction.setAuctionId(auctionEvent.getId());
            auction.setSellerId(auctionEvent.getSellerId());
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

    @KafkaListener(topics = "${item.updated.topic}", groupId = "bidder")
    public void handleAuctionUpdated(String event) {
        try {
            AuctionCreatedEvent auctionEvent = jsonMapper.readerFor(AuctionCreatedEvent.class)
                                                .readValue(event);
            Auction auction = auctionRepository.findById(auctionEvent.getId())
                                .orElseThrow(() -> new AuctionNotFoundException());;

            auction.setStatus(auctionEvent.getStatus());
            auctionRepository.save(auction);
            
            log.info("Item updated event received: {}", event);
            
        } catch (Exception e) {
            log.error("Failed to parse Item updated event: {}", event, e);
        }

    }

    @KafkaListener(topics = "${USER_WALLET_TOPIC}", groupId = "bidder")
    public void initialiseUserWallet(String event) {
        try {
            WalletDto walletEvent = jsonMapper.readerFor(WalletDto.class)
                                                .readValue(event);
            
            walletService.createWalletForNewUser(walletEvent.id(), walletEvent.balance());
            log.info("User Wallet event received: {},, Balance {}", event, walletEvent.balance());
            
        } catch (Exception e) {
            log.error("Failed User Wallet updated event: {}", event, e);
        }

    }
}
