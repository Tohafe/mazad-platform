package com.mazad.chat_service.repository;

import com.mazad.chat_service.model.Message;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;


@Repository
public interface MessageRepository extends JpaRepository<Message, UUID>
{
    List<Message> findByRoomIdOrderByTimestampAsc(String roomId);
    @Query(value = """
            SELECT * FROM (
                SELECT DISTINCT ON (room_id) *
                FROM messages
                WHERE receiver_id = :userId OR sender_id = :userId
                ORDER BY room_id, timestamp DESC
            ) sub
            ORDER BY timestamp DESC
            """, nativeQuery = true)
    List<Message> findInbox(@Param("userId") long userId);

    // List<Message> findByChatId(long chatId);
    // List<Message> FindBySenderId(long senderId);
    // List<Message> findByReceiverId(long receiverId);
    
}
