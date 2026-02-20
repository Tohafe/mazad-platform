package com.mazad.chat_service.service;

import  com.mazad.chat_service.repository.MessageRepository;

import lombok.extern.slf4j.Slf4j;

import  com.mazad.chat_service.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mazad.chat_service.dto.MessageChateventDTO;
import com.mazad.chat_service.infrastructure.kafka.ChatEventProducer;


@Slf4j
@Service 
public class MessageService {

    @Autowired
    MessageRepository repository;

    @Autowired
    ChatEventProducer chatEventProducer;



    public Message sendMessage(Message message, long myId)
    {
        message.setSenderId(myId);
        if (message.getSenderId() == message.getReceiverId())
            throw new IllegalArgumentException("you can not send a message to yourself."); 
        long minId = Math.min(message.getSenderId(), message.getReceiverId());
        long maxId = Math.max(message.getSenderId(), message.getReceiverId());
        String roomId = minId + "_" + maxId;
        
        message.setRoomId(roomId);

        Message savedMessage = repository.save(message);

        try {
            MessageChateventDTO savedMessageDTO = new MessageChateventDTO();
            savedMessageDTO.setId(savedMessage.getId());
            savedMessageDTO.setRoomId(savedMessage.getRoomId());
            savedMessageDTO.setSenderId(savedMessage.getSenderId());
            savedMessageDTO.setReceiverId(savedMessage.getReceiverId());
            savedMessageDTO.setContent(savedMessage.getContent());
            savedMessageDTO.setTimestamp(savedMessageDTO.getTimestamp());
            
            chatEventProducer.sendMessageEvent(savedMessageDTO);
        }
        catch (JsonProcessingException e)
        {
            log.error("XXXXXXXX preparing kafka error: {} ! XXXXXXXXX\n", e.getMessage());
            e.printStackTrace();
        }
        return savedMessage;
    }

    public Slice<Message> fetchChatHistory(long userId1, long userId2, Pageable pageable){
        
        long minId = Math.min(userId1, userId2);
        long maxId = Math.max(userId1, userId2);

        String roomId   = minId + "_" + maxId;
        return repository.findByRoomIdOrderByTimestampAsc(roomId, pageable);
    }   
}
