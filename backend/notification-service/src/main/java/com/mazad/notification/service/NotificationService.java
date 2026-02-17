package com.mazad.notification.service;

import com.mazad.notification.entity.NotificationEntity;
import com.mazad.notification.repo.NotificationRepo;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepo repository;   

    public Slice<NotificationEntity> getUnreadNotification(String userId, int pageNumber, int pageSize){
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
        return repository.findByUserIdAndIsReadFalse(userId, pageable);
    }

    public Slice<NotificationEntity> getNotifications(String userId, int pageNumber, int pageSize){
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
        return repository.findByUserId(userId, pageable);
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
