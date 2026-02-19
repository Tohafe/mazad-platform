package com.mazad.chat_service.controller;


import com.mazad.chat_service.repository.MessageRepository;
import com.mazad.chat_service.service.MessageService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import com.mazad.chat_service.model.Message;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/chat")
public class MessageController {
    
    @Autowired
    MessageRepository repo;
    @Autowired
    MessageService service;
    

    @PostMapping("/send")
    public Message sendMessage(
            @RequestHeader("X-User-Id") long myId,
            @Valid @RequestBody Message message) {
            // save this in repo by the save function ig 

        log.info("In Send RequestMapping");
        return service.sendMessage(message, myId);
    }
    
    @GetMapping("/history/{otherUserId}")
    public Slice<Message> fetchChatHistory(
        @RequestHeader("X-user-Id") long myId,
        @PathVariable long otherUserId,
        @PageableDefault(
            size = 2,
            sort = "timestamp",
            direction = Sort.Direction.DESC
        )
        Pageable pageable)
    {

        if (pageable.getPageSize() > 5){
            pageable = PageRequest.of(pageable.getPageNumber(), 5, pageable.getSort());
        }

        log.info("In post RequestMapping");
        log.info("Fetching history between " + myId + " and " + otherUserId);
        return service.fetchChatHistory(myId, otherUserId, pageable);
    }
    // TODO : end point for fetching the chats 
    // @GetMapping("/inbox/{userId}")
    // public List<Message> fetchInboxChats(@PathVariable long userId)
    // {
    //     System.out.println("In post RequestMapping");
    //     return service.fetchChatHistory(, userId);
    // }
}
