package com.mazad.notification.service;

import com.mazad.notification.entity.NotificationEntity;
import com.mazad.notification.repo.NotificationRepo;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;


@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepo repository;   

     public List<NotificationEntity> getUnreadNotifications(String userId) {
        List<NotificationEntity> unread = repository.findByUserIdAndIsReadFalse(userId);
        return unread;
        
    }

    public void markNotificationAsRead(Long notificationId, String userId) {

        NotificationEntity notification = repository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: This notification does not belong to you.");
        }

        notification.setRead(true);
        repository.save(notification);
    }

    public void markAllAsRead(String userId) {
        repository.markAllAsRead(userId);
    }

}
