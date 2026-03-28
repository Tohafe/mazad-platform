package com.mazad.auth.service;

import com.mazad.auth.entity.ApiKey;
import com.mazad.auth.repo.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final StringRedisTemplate redisTemplate;

    @Transactional
    public ApiKey generateAndSaveApiKey(UUID userId) {
        apiKeyRepository.findByUserId(userId)
                .ifPresent(existing -> {
                    apiKeyRepository.delete(existing);
                    redisTemplate.delete("apikey:" + existing.getApiKey());
                });

        String newKey = UUID.randomUUID().toString().replace("-", "");

        ApiKey apiKey = ApiKey.builder()
                .apiKey(newKey)
                .userId(userId)
                .build();

        ApiKey savedKey = apiKeyRepository.save(apiKey);

        redisTemplate.opsForValue().set("apikey:" + newKey, userId.toString());

        return savedKey;
    }

    public String getApiKey(UUID userId) {
        return apiKeyRepository.findByUserId(userId)
                .map(ApiKey::getApiKey)
                .orElse(null);
    }
}