package com.mazad.chat_service.service;

import  com.mazad.chat_service.repository.MessageRepository;

import lombok.extern.slf4j.Slf4j;

import  com.mazad.chat_service.model.Message;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mazad.chat_service.dto.MessageChateventDTO;
import com.mazad.chat_service.infrastructure.kafka.ChatEventProducer;
import org.springframework.transaction.annotation.Transactional;


@Slf4j
@Service 
public class MessageService {

    @Autowired
    MessageRepository repository;

    @Autowired
    ChatEventProducer chatEventProducer;

    @Transactional
    public void markConversationAsRead(UUID myId, UUID otherUserId) {
        String roomId = getRoomId(myId, otherUserId);
        repository.markMessageAsRead(roomId, myId);
        log.info("Marked messages as read in room {} for user {}", roomId, myId);
    }

    public Message sendMessage(Message message, UUID myId)
    {
        message.setSenderId(myId);
        if (message.getSenderId().equals(message.getReceiverId()))
            throw new IllegalArgumentException("you can not send a message to yourself."); 

        String roomId = getRoomId(message.getSenderId(), message.getReceiverId());   
        log.info("get roomid {}", roomId);

        message.setRoomId(roomId);

        Message savedMessage = repository.save(message);

        try {
            MessageChateventDTO savedMessageDTO = new MessageChateventDTO();
            savedMessageDTO.setId(savedMessage.getId());
            savedMessageDTO.setRoomId(savedMessage.getRoomId());
            savedMessageDTO.setSenderId(savedMessage.getSenderId());
            savedMessageDTO.setReceiverId(savedMessage.getReceiverId());
            savedMessageDTO.setContent(savedMessage.getContent());
            savedMessageDTO.setTimestamp(savedMessage.getTimestamp());
            
            chatEventProducer.sendMessageEvent(savedMessageDTO);
        }
        catch (JsonProcessingException e)
        {
            log.error("XXXXXXXX preparing kafka error: {} ! XXXXXXXXX\n", e.getMessage());
            e.printStackTrace();
        }
        return savedMessage;
    }

    public Slice<Message> fetchChatHistory(UUID userId1, UUID userId2, Pageable pageable){
        

        String roomId   = getRoomId(userId1, userId2);
        return repository.findByRoomIdOrderByTimestampDesc(roomId, pageable);
    }   

    public Slice<Message> fetchInbox(UUID myId, Pageable pageable){

        return repository.findInbox(myId, pageable);

    }

    private String getRoomId(UUID id1, UUID id2){
        if (id1.compareTo(id2) > 0){
            return id1.toString() + "_" + id2.toString();
        }
        else{
            return id2.toString() + "_" + id1.toString();
        }
    }
}
