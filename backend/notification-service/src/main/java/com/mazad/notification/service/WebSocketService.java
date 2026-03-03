package com.mazad.notification.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.mazad.notification.entity.NotificationEntity;
import com.mazad.notification.repo.NotificationRepo;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;




@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepo repository;

    public void sendPrivateMessage(String userId, String destination, String message,Object payload, String type){
        NotificationEntity entity = NotificationEntity.builder()
                                                .userId(userId)
                                                .message(message)
                                                .type(type)
                                                .isRead(false) 
                                                .build();

        NotificationEntity savedEntity = repository.save(entity);
        log.info("Saved Notification ID: {} for User: {} message {}", savedEntity.getId(), userId, message);
        messagingTemplate.convertAndSendToUser(userId, destination, savedEntity);
    }
    
    public void sendGlobalUpdate(String destination, Object payload) {
        
        log.info("Sending update to {}", destination);
        messagingTemplate.convertAndSend(destination, payload);
    }
    
}


