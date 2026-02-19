package com.mazad.chat_service.service;

import  com.mazad.chat_service.repository.MessageRepository;

import lombok.extern.slf4j.Slf4j;

import  com.mazad.chat_service.model.Message;

import org.hibernate.type.descriptor.jdbc.JavaTimeJdbcType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.annotation.*;


import org.springframework.kafka.support.SendResult;

// import com.mazad.chat_service.infrastructure.kafka.SendMessageProducer;

@Slf4j
@Service 
public class MessageService {

    @Autowired
    MessageRepository repository;


    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private final JsonMapper jsonMapper;
    public MessageService(){
        this.jsonMapper = new JsonMapper();
        this.jsonMapper.registerModule(new JavaTimeModule());
        this.jsonMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }




    @Value("${chat.kafka.topic}")
    private String topicName;


    public Message sendMessage(Message message)
    {
        long minId = Math.min(message.getSenderId(), message.getReceiverId());
        long maxId = Math.max(message.getSenderId(), message.getReceiverId());
        String roomId = minId + "_" + maxId;
        
        message.setRoomId(roomId);

        Message savedMessage = repository.save(message);


        try {
            String jsonPayload = jsonMapper.writeValueAsString(savedMessage);
            CompletableFuture<SendResult<String, String>> completableFuture = kafkaTemplate.send(topicName, roomId, jsonPayload);
            completableFuture.whenComplete(
                (result, ex) -> {
                    if (ex == null)
                    {
                        log.info("√: Kafka sent succefully: Topic: {}, Partition: {}, offset: {}", 
                            topicName,
                            result.getRecordMetadata().partition(),
                            result.getRecordMetadata().offset());
                    }
                    else {
                        log.error("X Kafka faild sending: message ID: {}. Error: {} ",
                            savedMessage.getId(),
                            ex.getMessage());

                    }
                }
            );
        }
        catch (Exception e)
        {
            log.error("XXXXXXXX preparing kafka error: {} ! XXXXXXXXX\n", e.getMessage());
            e.printStackTrace();
        }
        return savedMessage;
    }

    public List<Message> fetchChatHistory(long userId1, long userId2){
        
        long minId = Math.min(userId1, userId2);
        long maxId = Math.max(userId1, userId2);

        String roomId   = minId + "_" + maxId;
        return repository.findByRoomIdOrderByTimestampAsc(roomId);
    }

    
}
