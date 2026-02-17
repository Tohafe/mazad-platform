package com.mazad.chat_service.controller;


import com.mazad.chat_service.repository.MessageRepository;
import com.mazad.chat_service.model.Message;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("api/chat")
public class MessageController {
    
    @Autowired
    MessageRepository Repo;

    @PostMapping("/send")
    public Message sendMessage(@RequestBody Message message) {
        // save this in repo by the save function ig 

        System.out.println("In Send RequestMapping");
        return Repo.save(message);
    }
    
    @GetMapping("/receive/{userId}")
    public List<Message> receiveMessage(@PathVariable long userId)
    {
        System.out.println("In post RequestMapping");
        return Repo.findByReceiverId(userId);
    }


    
}
