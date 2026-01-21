package com.mazad.auth.repo;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.mazad.auth.entity.RefreshToken;


@Repository
public interface RefreshTokenRepo extends JpaRepository<RefreshToken, UUID>{
    Optional<RefreshToken> findByToken(String token);
    boolean existsByToken(String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM RefreshToken t WHERE t.expiryDate <= :now")
    int deleteExpiredTokens(@Param("now") Instant now);
}
