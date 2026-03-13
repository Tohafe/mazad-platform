package com.mazad.notification.service;

import org.springframework.kafka.annotation.KafkaListener;
import com.mazad.notification.entity.NotificationEntity;
import org.springframework.stereotype.Component;
import com.mazad.notification.dto.AuctionStatus;
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
            webSocketService.sendGlobalUpdate("/topic/auctions" , bidEvent );

            if(bidEvent.getStatus() == AuctionStatus.ACTIVE 
                && bidEvent.getPreviousBidderId() != null
                && !bidEvent.getLastBidderId().equals(bidEvent.getPreviousBidderId()))
            {
                NotificationEntity entity = NotificationEntity.builder()
                        .userId(bidEvent.getPreviousBidderId())
                        .message("You have been outbid on auction, Check it out")
                        .targetUrl("/auction/" + bidEvent.getAuctionId())
                        .build();
                webSocketService.sendPrivateMessage(bidEvent.getPreviousBidderId(), "/queue/notification",
                                                     entity, null, true);
            }
            else if(bidEvent.getLastBidderId() != null
                    && bidEvent.getStatus() == AuctionStatus.CLOSED)
            {
                NotificationEntity entity = NotificationEntity.builder()
                        .userId(bidEvent.getLastBidderId())
                        .message("Congratulations! You won the auction. Your winning bid is: " + bidEvent.getCurrentHighestBid() 
                                    + ", Check it out")
                        .targetUrl("/auction/" + bidEvent.getAuctionId())
                        .build();
                webSocketService.sendPrivateMessage(bidEvent.getLastBidderId(), "/queue/notification",
                                                     entity, null, true);
            }
                    

        } 
        catch (Exception e) {
            log.error("Failed to process Kafka event: {}", event, e);
        }
    }
}





