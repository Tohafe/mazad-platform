package com.mazad.chat_service.controller;


import com.mazad.chat_service.repository.MessageRepository;
import com.mazad.chat_service.service.MessageService;

import lombok.extern.slf4j.Slf4j;

import com.mazad.chat_service.model.Message;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/chat")
public class MessageController {
    
    @Autowired
    MessageRepository repo;
    @Autowired
    MessageService service;
    
    @PostMapping("/send")
    public Message sendMessage(@RequestBody Message message) {
        // save this in repo by the save function ig 

        log.info("In Send RequestMapping");
        return service.sendMessage(message);
    }
    
    @GetMapping("/history/{otherUserId}")
    public List<Message> fetchChatHistory(
        @RequestHeader("X-user-Id") long myId,
        @PathVariable long otherUserId)
    {
        log.info("In post RequestMapping");
        log.info("Fetching history between " + myId + " and " + otherUserId);
        return service.fetchChatHistory(myId, otherUserId);
    }
    // TODO : end point for fetching the chats 
    // @GetMapping("/inbox/{userId}")
    // public List<Message> fetchInboxChats(@PathVariable long userId)
    // {
    //     System.out.println("In post RequestMapping");
    //     return service.fetchChatHistory(, userId);
    // }
}
