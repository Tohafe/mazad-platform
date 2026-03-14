package com.mazad.notification.service;

import org.springframework.kafka.annotation.KafkaListener;
import com.mazad.notification.entity.NotificationEntity;
import com.mazad.notification.dto.FriendRequestEvent;
import com.mazad.notification.dto.FriendshipStatus;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class FriendRequestListener {
    private final ObjectMapper objectMapper;
    private final WebSocketService webSocketService;

    @KafkaListener(
        topics = "${spring.kafka.topics.friend-request-events}", 
        groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleFriendRequest(String event){
        try {
            FriendRequestEvent friendRequestEvent= objectMapper.readValue(event, FriendRequestEvent.class);

            if(friendRequestEvent.getStatus() == FriendshipStatus.ACCEPTED){
                NotificationEntity entity = NotificationEntity.builder()
                                            .userId(friendRequestEvent.getTargetId())
                                            .message(friendRequestEvent.getUsername() + " Accepted your connection")
                                            .targetUrl("/profile/" + friendRequestEvent.getUsername())
                                            .build();
                webSocketService.sendPrivateMessage(friendRequestEvent.getTargetId(), "/queue/notification",
                                                     entity, null, true);
            }
            else if(friendRequestEvent.getStatus() == FriendshipStatus.PENDDING){
                NotificationEntity entity = NotificationEntity.builder()
                                            .userId(friendRequestEvent.getTargetId())
                                            .message(friendRequestEvent.getUsername() + " sent you a connection request")
                                            .targetUrl("/profile/" + friendRequestEvent.getUsername())
                                            .build();
                webSocketService.sendPrivateMessage(friendRequestEvent.getTargetId(), "/queue/notification",
                                                     entity, null, true);
            }
            
        } catch (Exception e) {
            log.error("Failed to process Kafka event: {}", event, e);
            throw new RuntimeException("Kafka event processing failed ", e);
        }
    }
}
