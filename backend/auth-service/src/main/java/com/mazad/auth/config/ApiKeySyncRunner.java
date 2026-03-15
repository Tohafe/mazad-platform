package com.mazad.auth.config;

import com.mazad.auth.entity.ApiKey;
import com.mazad.auth.repo.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApiKeySyncRunner implements CommandLineRunner {

    private final ApiKeyRepository apiKeyRepository;
    private final StringRedisTemplate redisTemplate;

    @Override
    public void run(String... args) {
        log.info("Syncing API Keys to Redis...");
        List<ApiKey> keys = apiKeyRepository.findAll();

        for (ApiKey key : keys)
            redisTemplate.opsForValue().set("apikey:" + key.getApiKey(), key.getUserId().toString());

        log.info("Successfully synced {} API keys.", keys.size());
    }
}