package com.mazad.bidding_service.infrastructure.kafka;


import com.mazad.bidding_service.domain.auction.Auction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import tools.jackson.databind.json.JsonMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuctionUpdateProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    private final JsonMapper jsonMapper;
    
    @Value("${auction.update.topic}")
    private String updateTopic;
    
    public void sendUpdate(@NonNull Auction auction) {
        AuctionUpdateEvent event = new AuctionUpdateEvent(
                auction.getAuctionId(),
                auction.getCurrentHighestBid(),
                auction.getEndsAt(),
                auction.getStatus(),
                auction.getCurrentHighestBidderId()
        );

        String data = jsonMapper.writeValueAsString(event);
        kafkaTemplate.send(updateTopic, auction.getAuctionId().toString(), data)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Sent update for auction {} to Kafka", auction.getAuctionId());
                    } else {
                        log.error("Failed to send Kafka update for auction {}", auction.getAuctionId(), ex);
                    }
                });
    }
}