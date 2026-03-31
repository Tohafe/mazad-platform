package com.mazad.chat_service.controller;

import java.util.ArrayList;
import java.util.List;

import com.mazad.chat_service.service.MessageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.mazad.chat_service.dto.InboxResponseDTO;
import com.mazad.chat_service.dto.MessageRequestDTO;
import com.mazad.chat_service.dto.MessageResponseDTO;
import com.mazad.chat_service.model.Message;

import java.util.UUID;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;



@Slf4j
@RestController
@RequestMapping("api/v1/chat")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService service;
    

    @PostMapping("/send")
    public MessageResponseDTO sendMessage(
            @RequestHeader("X-User-Id") UUID myId,
            @Valid @RequestBody MessageRequestDTO message) {

        return service.sendMessage(message, myId);
    }
    
    @GetMapping("/history/{otherUserId}")
    public List<MessageResponseDTO> fetchChatHistory(
        @RequestHeader("X-User-Id") UUID myId,
        @PathVariable UUID otherUserId)
    {
        List<Message> rawMessages = service.fetchChatHistory(myId, otherUserId);
        List<MessageResponseDTO> rslt = new ArrayList<>();

        rawMessages.forEach(message -> {
            MessageResponseDTO dto = new MessageResponseDTO();
            dto.setId(message.getId());
            dto.setSenderId(message.getSenderId());
            dto.setContent(message.getContent());
            dto.setTimestamp(message.getTimestamp());
            rslt.add(dto);
        });
        return rslt;
    }

    @GetMapping("/inbox")
    public List<InboxResponseDTO> fetchInbox(@RequestHeader("X-User-Id") UUID myId){
        
        List<Message> inboxMessages = service.fetchInbox(myId);
        List<InboxResponseDTO> result = new ArrayList<>();
         inboxMessages.forEach(message -> {
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
            result.add(dto);
        });
        return result;
    }
    
    @PatchMapping("/read/{otherUserId}")    
    public ResponseEntity<Void> markAsRead(
        @RequestHeader("X-User-Id") UUID myId,
        @PathVariable UUID otherUserId) 
    {
            service.markConversationAsRead(myId, otherUserId);
            return ResponseEntity.ok().build();
    }
}
