package com.mazad.notification.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.mazad.notification.entity.NotificationEntity;
import com.mazad.notification.repo.NotificationRepo;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.List;




@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepo repository;

    public void sendPrivateMessage(String userId, String destination, NotificationEntity entity, Object payload, boolean save){
        if(save){
            NotificationEntity savedEntity = repository.save(entity);
            messagingTemplate.convertAndSendToUser(userId, destination, savedEntity);
        }
        else{
            log.info("Saved Notification ID: {} for User: {} destination {}", userId, destination);
            messagingTemplate.convertAndSendToUser(userId, destination, payload);
        }
    }
    
    public void sendGlobalUpdate(String destination, Object payload) {
        
        log.info("Sending update to {}", destination);
        messagingTemplate.convertAndSend(destination, payload);
    }

    @Transactional
    public void sendPrivateAll(List<String> userIds, String message, String targetUrl, String destination) {

        List<NotificationEntity> batch = new ArrayList<>(userIds.size());

        for (String userId : userIds) {
            batch.add(NotificationEntity.builder()
                    .userId(userId)
                    .message(message)
                    .targetUrl(targetUrl)
                    .build());
        }

        List<NotificationEntity> savedBatch = repository.saveAll(batch);

        for (NotificationEntity savedNotification : savedBatch) {
            messagingTemplate.convertAndSendToUser(
                    savedNotification.getUserId(),
                    destination,
                    savedNotification
            );
        }
    }
    
}


