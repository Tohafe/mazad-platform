package com.mazad.chat_service.repository;

import com.mazad.chat_service.model.Message;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;



@Repository
public interface MessageRepository extends JpaRepository<Message, UUID>
{

    List<Message> findByChatId(long chatId);
    // List<Message> FindBySenderId(long senderId);
    List<Message> findByReceiverId(long receiverId);
    
}
