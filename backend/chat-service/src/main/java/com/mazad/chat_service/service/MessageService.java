package com.mazad.chat_service.service;
import  com.mazad.chat_service.repository.MessageRepository;
import  com.mazad.chat_service.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class MessageService {

    @Autowired
    MessageRepository repository;


    public Message sendMessage(Message message)
    {
        Message savedMessage = repository.save(message);
        return savedMessage;
    }

    // public List<Message> fetchChatHistory(long chatId){
        

        // return repository.findByChatIdOrderByTimestampAsc(chatId);
    // }
    
}
