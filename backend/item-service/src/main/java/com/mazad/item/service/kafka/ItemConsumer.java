package com.mazad.item.service.kafka;


import com.mazad.item.dto.event.ItemUpdatedEventDto;
import com.mazad.item.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.json.JsonMapper;

@Slf4j
@RequiredArgsConstructor
@Component
public class ItemConsumer {
    private final ItemService itemService;

    private final JsonMapper jsonMapper;

    @KafkaListener(topics = "${auction.update.topic}", groupId = "Item")
    public void handleItemUpdateEvent(String event) {
        log.info("Received item update event: {}", event);
        try {
            ItemUpdatedEventDto itemEvent = jsonMapper.readerFor(ItemUpdatedEventDto.class)
                    .readValue(event);
            itemService.applyUpdateEvent(itemEvent);
            log.info("Update event applied successfully!: {}", itemEvent.auctionId());
        } catch (JacksonException e) {
            log.error("Jackson parsing failed: {}", e.getMessage());
        }
    }
}
