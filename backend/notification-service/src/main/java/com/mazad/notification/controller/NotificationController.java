package com.mazad.notification.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.mazad.notification.service.NotificationService;
import org.springframework.web.bind.annotation.PutMapping;
import com.mazad.notification.entity.NotificationEntity;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import java.util.List;




@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notifactionService;

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationEntity>> getUnreadNotifications(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(notifactionService.getUnreadNotifications(userId)) ;
    }
        
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long id, @RequestHeader("X-User-Id") String userId){
        notifactionService.markNotificationAsRead(id, userId);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@RequestHeader("X-User-Id") String userId) {
        notifactionService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }


}
