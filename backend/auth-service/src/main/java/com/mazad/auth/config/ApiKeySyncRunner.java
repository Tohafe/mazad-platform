package com.mazad.auth.config;

import com.mazad.auth.entity.ApiKey;
import com.mazad.auth.repo.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApiKeySyncRunner implements CommandLineRunner {

    private final ApiKeyRepository apiKeyRepository;
    private final StringRedisTemplate redisTemplate;

    @Override
    public void run(String... args) {
        log.info("Syncing API Keys to Redis...");

        // Remove any existing API key entries to avoid stale keys remaining valid
        Set<String> existingKeys = redisTemplate.keys("apikey:*");
        if (existingKeys != null && !existingKeys.isEmpty()) {
            redisTemplate.delete(existingKeys);
            log.info("Cleared {} existing API keys from Redis.", existingKeys.size());
        }

        List<ApiKey> keys = apiKeyRepository.findAll();

        for (ApiKey key : keys) {
            redisTemplate.opsForValue().set("apikey:" + key.getApiKey(), key.getUserId().toString());
        }

        log.info("Successfully synced {} API keys.", keys.size());
    }
}