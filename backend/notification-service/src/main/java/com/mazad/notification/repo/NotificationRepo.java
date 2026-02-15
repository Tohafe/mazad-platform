package com.mazad.notification.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import com.mazad.notification.entity.NotificationEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;
import java.util.List;


@Repository
public interface NotificationRepo extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByUserIdAndIsReadFalse(String userId);

    List<NotificationEntity> findByUserIdOrderByCreatedAtDesc(String userId);

    @Modifying 
    @Transactional 
    @Query("UPDATE NotificationEntity n SET n.isRead = true WHERE n.userId = :userId")
    void markAllAsRead(String userId);
}
