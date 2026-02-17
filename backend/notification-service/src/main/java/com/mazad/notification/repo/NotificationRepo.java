package com.mazad.notification.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import com.mazad.notification.entity.NotificationEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import jakarta.transaction.Transactional;


@Repository
public interface NotificationRepo extends JpaRepository<NotificationEntity, Long> {
    Slice<NotificationEntity>  findByUserId(String userId, Pageable pageable);

    Slice<NotificationEntity> findByUserIdAndIsReadFalse(String userId, Pageable pageable);



    @Modifying 
    @Transactional 
    @Query("UPDATE NotificationEntity n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    void markAllAsRead(String userId);
}
