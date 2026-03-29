package com.mazad.notification.service;


import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.mazad.notification.dto.ChatEvent;
import tools.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;




@Component
@RequiredArgsConstructor
@Slf4j
public class ChatEventListener {
    private final ObjectMapper objectMapper;  
    private final WebSocketService webSocketService;


    @KafkaListener(
        topics = "${spring.kafka.topics.chat-events}", 
        groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleChatEvent(String event){
        try {
            ChatEvent chatEvent = objectMapper.readValue(event, ChatEvent.class);
            
            log.info("Received chat Event for sender ID: {}", chatEvent.getSenderId());
            webSocketService.sendPrivateMessage(chatEvent.getReceiverId(), "/queue/messages", null, chatEvent, false);
            webSocketService.sendPrivateMessage(chatEvent.getSenderId(), "/queue/messages", null, chatEvent, false);
        } 
        catch (Exception e) {
            log.error("Failed to process Kafka event: {}", event, e);
            throw new RuntimeException("Kafka event processing failed ", e);
        }
    }
}
