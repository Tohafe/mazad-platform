package com.mazad.chat_service.repository;

import com.mazad.chat_service.model.Message;

import java.util.UUID;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID>
{
    List<Message> findByRoomIdOrderByTimestampDesc(String roomId);

    @Query(value = """
            SELECT * FROM (
                SELECT DISTINCT ON (room_id) *
                FROM messages
                WHERE receiver_id = :userId OR sender_id = :userId
                ORDER BY room_id, timestamp DESC
            ) sub
            ORDER BY timestamp DESC
            """, nativeQuery = true)
    List<Message> findInbox(@Param("userId") UUID userId);
   
    @Modifying
    @Transactional
    @Query("UPDATE Message m SET m.isRead = true WHERE m.roomId = :roomId AND m.receiverId = :userId AND m.isRead = false")
    void markMessageAsRead(@Param("roomId") String roomId, @Param("userId") UUID userId);

}
