package com.mazad.chat_service.mapper;

import org.springframework.stereotype.Component;

import com.mazad.chat_service.dto.MessageRequestDTO;
import com.mazad.chat_service.dto.MessageResponseDTO;
import com.mazad.chat_service.model.Message;



@Component
public class  MessageMapper
{
    public Message dtoToEntity(MessageRequestDTO dto) {
        return (Message
            .builder()
            .receiverId(dto.receiverId())
            .content(dto.content())
            .build());
    }

    public MessageResponseDTO entityToResponseDTO (Message entity) {
        return MessageResponseDTO
            .builder()
            .id(entity.getId())
            .senderId(entity.getSenderId())
            .content(entity.getContent())
            .timestamp(entity.getTimestamp())
            .build();
    }
}
