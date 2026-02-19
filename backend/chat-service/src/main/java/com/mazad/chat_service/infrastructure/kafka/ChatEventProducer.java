package com.mazad.chat_service.infrastructure.kafka;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mazad.chat_service.model.Message;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ChatEventProducer {

    private KafkaTemplate<String, String> kafkaTemplate;
    
    private final JsonMapper jsonMapper;

    @Value("${chat.kafka.topic}")
    private String topicName;

    
    public ChatEventProducer(KafkaTemplate<String, String> kafkaTemplate){
        this.kafkaTemplate = kafkaTemplate;
        this.jsonMapper = new JsonMapper();
        this.jsonMapper.registerModule(new JavaTimeModule());
        this.jsonMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }
    
    
    public void sendMessageEvent(Message savedMessage) throws JsonProcessingException{
        
        String jsonPayload = jsonMapper.writeValueAsString(savedMessage);
        CompletableFuture<SendResult<String, String>> completableFuture = kafkaTemplate.send(topicName, savedMessage.getRoomId(), jsonPayload);
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

    
}
