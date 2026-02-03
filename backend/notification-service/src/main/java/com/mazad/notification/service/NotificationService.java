package com.mazad.notification.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;
import com.mazad.notification.dto.BidEvent;
import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class NotificationService {
    private final ObjectMapper objectMapper;   


    @KafkaListener(
        topics = "${spring.kafka.topics.bid-events}", 
        groupId = "${spring.kafka.consumer.group-id}"
    )
    public void fetchBids(String event){
        try {
            BidEvent bidEvent = objectMapper.readValue(event, BidEvent.class);
            System.out.println(bidEvent);            
        } catch (Exception e) { 
            throw new RuntimeException("Failed to deserialize bid event JSON into BidEvent DTO" + e.getMessage());
        }
    }
    
}
