package com.mazad.notification.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.mazad.notification.dto.BidEvent;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;




@Component
@RequiredArgsConstructor
@Slf4j
public class BidEventListener {

    private final ObjectMapper objectMapper;  
    private final WebSocketService webSocketService;

    @KafkaListener(
        topics = "${spring.kafka.topics.bid-events}", 
        groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleBidEvent(String event){
        try {
            BidEvent bidEvent = objectMapper.readValue(event, BidEvent.class);
            
            log.info("Received Bid Event for auction ID: {}", bidEvent.getAuctionId());
            
            webSocketService.sendGlobalUpdate("/topic/auction/" + bidEvent.getAuctionId(), bidEvent );

            webSocketService.sendPrivateMessage(bidEvent.getLastBidderId(),"/queue/notification",
                                                        "the highest bid: " + bidEvent.getCurrentHighestBid(),
                                                         bidEvent, "bid");
        } 
        catch (Exception e) {
            log.error("Failed to process Kafka event: {}", event, e);
        }
    }
}





