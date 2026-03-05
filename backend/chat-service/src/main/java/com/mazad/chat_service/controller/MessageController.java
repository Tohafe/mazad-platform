package com.mazad.chat_service.controller;

import org.springframework.web.bind.annotation.PatchMapping;

import com.mazad.chat_service.repository.MessageRepository;
import com.mazad.chat_service.service.MessageService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import com.mazad.chat_service.dto.InboxResponseDTO;
import com.mazad.chat_service.dto.MessageResponseDTO;
import com.mazad.chat_service.model.Message;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;



@Slf4j
@RestController
@RequestMapping("api/v1/chat")
public class MessageController {
    
    @Autowired
    MessageRepository repo;
    @Autowired
    MessageService service;
    

    @PostMapping("/send")
    public MessageResponseDTO sendMessage(
            @RequestHeader("X-User-Id") UUID myId,
            @Valid @RequestBody Message message) {
            // save this in repo by the save function ig 
        Message sentMessageEntity = service.sendMessage(message, myId);
        MessageResponseDTO dto = new MessageResponseDTO();
        dto.setId(sentMessageEntity.getId());
        dto.setSenderId(sentMessageEntity.getSenderId());
        dto.setContent(sentMessageEntity.getContent());
        dto.setTimestamp(sentMessageEntity.getTimestamp());

        log.info("In Send RequestMapping");
        return  dto ;
    }
    
    @GetMapping("/history/{otherUserId}")
    public Slice<MessageResponseDTO> fetchChatHistory(
        @RequestHeader("X-User-Id") UUID myId,
        @PathVariable UUID otherUserId,
        @PageableDefault(
            size = 20,
            sort = "timestamp",
            direction = Sort.Direction.DESC
        )
        Pageable pageable)
    {

        if (pageable.getPageSize() > 50){
            pageable = PageRequest.of(pageable.getPageNumber(), 20, pageable.getSort());
        }

        log.info("In post RequestMapping");
        log.info("Fetching history between " + myId + " and " + otherUserId);
        Slice<Message> rawMessages = service.fetchChatHistory(myId, otherUserId, pageable);

        return rawMessages.map(message -> {
            MessageResponseDTO dto = new MessageResponseDTO();
            dto.setId(message.getId());
            dto.setSenderId(message.getSenderId());
            dto.setContent(message.getContent());
            dto.setTimestamp(message.getTimestamp());
            return dto;
        })
        ;
    }
    @GetMapping("/inbox")
    public Slice<InboxResponseDTO> fetchInbox(@RequestHeader("X-User-Id") UUID myId,
            @PageableDefault(
                size = 20
            )                                
            Pageable pageable){
        
        
        
        log.info("In get (fetchInbox) for user {}", myId);

        Slice<Message> inboxMessages = service.fetchInbox(myId, pageable);

        return inboxMessages.map(message -> {
            InboxResponseDTO dto = new InboxResponseDTO();
            dto.setRoomId(message.getRoomId());
            dto.setLastMessage(message.getContent());
            dto.setTimestamp(message.getTimestamp());

            UUID otherUserId;
            if (myId.equals(message.getSenderId())){
                otherUserId = message.getReceiverId();
                dto.setHasUnreadMessages(false);
            }
            else {
                otherUserId = message.getSenderId();
                dto.setHasUnreadMessages(!message.isRead());

            }
            dto.setOtherUserId(otherUserId);
            return dto;
        });
    }
    
    @PatchMapping("/read/{otherUserId}")    
    public ResponseEntity<Void> markAsRead(
        @RequestHeader("X-User-Id") UUID myId,
        @PathVariable UUID otherUserId) 
    {
            log.info("User {} is marking message from {} as read",  myId, otherUserId);
            service.markConversationAsRead(myId, otherUserId);
            return ResponseEntity.ok().build();
    }
        

    }
