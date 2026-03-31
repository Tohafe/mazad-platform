package com.mazad.chat_service.service;

import  java.util.UUID;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mazad.chat_service.dto.MessageChateventDTO;
import com.mazad.chat_service.infrastructure.kafka.ChatEventProducer;
import com.mazad.chat_service.model.Message;
import com.mazad.chat_service.repository.MessageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.mazad.chat_service.dto.MessageRequestDTO;
import com.mazad.chat_service.dto.MessageResponseDTO;
import com.mazad.chat_service.mapper.MessageMapper;

@Slf4j
@Service 
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository repository;

    private final ChatEventProducer chatEventProducer;

    private final MessageMapper mapper;
    @Transactional
    public void markConversationAsRead(UUID myId, UUID otherUserId) {
        String roomId = getRoomId(myId, otherUserId);
        repository.markMessageAsRead(roomId, myId);
    }

    public MessageResponseDTO sendMessage(MessageRequestDTO messageDto, UUID myId)
    {
        Message message = mapper.dtoToEntity(messageDto);
        message.setSenderId(myId);
        if (myId.equals(message.getReceiverId()))
            throw new IllegalArgumentException("you can not send a message to yourself."); 

        String roomId = getRoomId(myId, message.getReceiverId());   

        message.setRoomId(roomId);

        message = repository.saveAndFlush(message);

        try {
            MessageChateventDTO savedMessageDTO = new MessageChateventDTO();
            savedMessageDTO.setId(message.getId());
            savedMessageDTO.setRoomId(message.getRoomId());
            savedMessageDTO.setSenderId(message.getSenderId());
            savedMessageDTO.setReceiverId(message.getReceiverId());
            savedMessageDTO.setContent(message.getContent());
            savedMessageDTO.setTimestamp(message.getTimestamp());
            
            chatEventProducer.sendMessageEvent(savedMessageDTO);
        }
        catch (JsonProcessingException e)
        {
            log.error("XXXXXXXX preparing kafka error: {} ! XXXXXXXXX\n", e.getMessage());
        }
        return mapper.entityToResponseDTO(message);
    }

    public List<Message> fetchChatHistory(UUID userId1, UUID userId2){
        

        String roomId   = getRoomId(userId1, userId2);
        return repository.findByRoomIdOrderByTimestampDesc(roomId);
    }   

    public List<Message> fetchInbox(UUID myId){

        return repository.findInbox(myId);

    }

    private String getRoomId(UUID id1, UUID id2){
        if (id1.compareTo(id2) > 0){
            return id1.toString() + "_" + id2.toString();
        }
        else{
            return id2.toString() + "_" + id1.toString();
        }
    }

    public ChatEventProducer getChatEventProducer() {
        return chatEventProducer;
    }
}
