package com.mazad.auth.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.json.JsonMapper;

@AllArgsConstructor
@Service
@Slf4j
public class KafkaProducerService {
    private final JsonMapper jsonMapper;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public void produce(String topic, Object dto){
        String data = jsonMapper.writeValueAsString(dto);

        kafkaTemplate
            .send(topic, data)
            .whenComplete((result, e) -> {
                if (e == null)
                    log.info("PRODUCING SUCCESS, THE TOPIC = {}, Data = {}", topic, data);
                else      
                    log.info("PRODUCING FAILED, THE TOPIC = {}, Data = {}", topic, data);
            });
    }
}
