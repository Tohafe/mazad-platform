package com.mazad.notification.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.mazad.notification.dto.FriendsEvent;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class FriendsEventListener {
    private final ObjectMapper objectMapper;  
    private final WebSocketService webSocketService;


    @KafkaListener(
        topics = "${spring.kafka.topics.friends-events}", 
        groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleFriendsEvent(String event){
        try {
            FriendsEvent friendsEvent = objectMapper.readValue(event, FriendsEvent.class);
            log.info("Received Auction Event for the UserName: {}", friendsEvent.getUsername());

            String message;
            if(friendsEvent.isDelete())
                message = friendsEvent.getUsername() + " Removed an auction listing";
            else
                message = friendsEvent.getUsername() + " Created a new auction, Check it out";

            String targetUrl = "/auction/" + friendsEvent.getAuctionId();
            webSocketService.sendPrivateAll(friendsEvent.getFriendIds(), message, targetUrl, "/queue/notification");
            
        } catch (Exception e) {
            log.error("Failed to process Kafka event: {}", event, e);
        }
    }

    
}
