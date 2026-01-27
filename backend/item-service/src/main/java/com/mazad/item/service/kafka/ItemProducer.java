package com.mazad.item.service.kafka;

import com.mazad.item.dto.ItemEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.json.JsonMapper;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemProducer {

    @Value("${item.created.topic}")
    private String itemCreatedTopic;
    @Value("${item.updated.topic}")
    private String itemUpdatedTopic;

    private final JsonMapper jsonMapper;

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendItemCreatedEvent(ItemEventDto event) {
        String data = jsonMapper.writeValueAsString(event);
        kafkaTemplate.send(itemCreatedTopic, data)
                .whenComplete((result, error) -> {
                    if (error != null) log.error("Failed to send item creation event!: {}", error.getMessage());
                    else log.info("Item creation event sent successfully!: {}", data);
                });
    }

   public void sendItemUpdatedEvent(ItemEventDto event) {
       String data = jsonMapper.writeValueAsString(event);
       kafkaTemplate.send(itemUpdatedTopic, data)
               .whenComplete((result, error) -> {
                   if (error != null) log.error("Failed to send item update event!: {}", error.getMessage());
                   else log.info("Item update event sent successfully!: {}", data);
               });
   }
}
