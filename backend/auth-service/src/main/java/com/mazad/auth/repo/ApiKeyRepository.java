package com.mazad.auth.repo;

import com.mazad.auth.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID> {

    Optional<ApiKey> findByUserId(UUID userId);

    Optional<ApiKey> findByApiKey(String apiKey);

    void deleteByUserId(UUID userId);
}