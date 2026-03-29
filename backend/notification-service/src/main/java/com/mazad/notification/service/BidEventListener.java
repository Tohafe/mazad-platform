package com.mazad.notification.service;

import org.springframework.kafka.annotation.KafkaListener;
import com.mazad.notification.entity.NotificationEntity;
import org.springframework.stereotype.Component;
import com.mazad.notification.dto.AuctionStatus;
import com.mazad.notification.dto.BidEvent;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.Instant;




@Component
@RequiredArgsConstructor
@Slf4j
public class BidEventListener {

    private final ObjectMapper objectMapper;  
    private final WebSocketService webSocketService;

    private record AvailableBalance(Long availableBalance) {}

    private record AuctionUpdateEvent(
        Long auctionId,
        Long currentHighestBid,
        Instant endsAt,
        AuctionStatus status,
        String lastBidderId
    ) {}

    @KafkaListener(
        topics = "${spring.kafka.topics.bid-events}", 
        groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleBidEvent(String event){
        try {
            BidEvent bidEvent = objectMapper.readValue(event, BidEvent.class);
            
            AuctionUpdateEvent auctionUpdateEvent = new AuctionUpdateEvent(
                    bidEvent.getAuctionId(),
                    bidEvent.getCurrentHighestBid(),
                    bidEvent.getEndsAt(),
                    bidEvent.getStatus(),
                    bidEvent.getLastBidderId()
            );

            log.info("Received Bid Event for auction ID: {}", bidEvent.getAuctionId());
            
            webSocketService.sendGlobalUpdate("/topic/auction/" + bidEvent.getAuctionId(), auctionUpdateEvent );
            webSocketService.sendGlobalUpdate("/topic/auctions" , auctionUpdateEvent );

            if(bidEvent.getStatus() == AuctionStatus.ACTIVE ){
                onAuctionActive(bidEvent);
            }
            else if(bidEvent.getLastBidderId() != null){
                onAuctionSold(bidEvent);
            }
        } 
        catch (Exception e) {
            log.error("Failed to process Kafka event: {}", event, e);
            throw new RuntimeException("Kafka event processing failed ", e);
        }
    }

    private void onAuctionActive(BidEvent bidEvent) {
        sendBlance(bidEvent.getLastBidderId(), bidEvent.getLastBidderAvailableBalance());

        if(bidEvent.getPreviousBidderId() != null && 
            !bidEvent.getLastBidderId().equals(bidEvent.getPreviousBidderId()))
        {
            sendBlance(bidEvent.getPreviousBidderId(), bidEvent.getPreviousBidderIdAvailableBalance());

            sendAuctionNotification(bidEvent.getPreviousBidderId(), "You have been outbid on auction, Check it out!", 
                            bidEvent.getAuctionId());
        }
    }

    private void onAuctionSold(BidEvent bidEvent){

        sendBlance(bidEvent.getLastBidderId(), bidEvent.getLastBidderAvailableBalance());
        sendBlance(bidEvent.getSellerId(), bidEvent.getSellerAvailableBalance());

        sendAuctionNotification(bidEvent.getLastBidderId(), 
                        "Congratulations! You won the auction. Your winning bid is: " 
                        + bidEvent.getCurrentHighestBid() 
                        + ", Check it out!",
                         bidEvent.getAuctionId());

        sendAuctionNotification(bidEvent.getSellerId(),
             "Your item has been sold at auction. Check it out!",
                        bidEvent.getAuctionId());
    }

    private void sendAuctionNotification(String userId, String message, Long auctionId){
        NotificationEntity entity = NotificationEntity.builder()
        .userId(userId)
        .message(message)
        .targetUrl("/auction/" + auctionId)
        .build();

        webSocketService.sendPrivateMessage(userId, "/queue/notification", entity,
                                                 null, true);
    }

    private void sendBlance(String userID, Long balance){
        AvailableBalance availableBalance = new AvailableBalance(balance);
        webSocketService.sendPrivateMessage(userID, "/queue/balance",
                                        null, availableBalance, false);
    }
}





