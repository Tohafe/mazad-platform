package com.mazad.auth.service;

import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mazad.auth.dto.TokensDto;
import com.mazad.auth.entity.RefreshToken;
import com.mazad.auth.entity.UserEntity;
import com.mazad.auth.repo.RefreshTokenRepo;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class JwtService {
    private final RefreshTokenRepo tokenRepo;

    @Value("${auth.secret-key}")
    private String secretKey;
    
    @Value("${auth.access-token-validity-min:15}")
    private long accessValidity;
    
    @Value("${auth.refresh-token-validity-days:4}")
    private long refreshValidity; 

    public String generateAccessToken(UserEntity user){
       return Jwts.builder()
            .subject(user.getUserName())
            .claim("userId", user.getId())
            .issuedAt(Date.from(Instant.now()))
            .expiration(Date.from(Instant.now().plusMillis(TimeUnit.MINUTES.toMillis(accessValidity))))
            .signWith(generateKeyFromString(secretKey))
            .compact();
    }
    
    private SecretKey generateKeyFromString(String key){
        byte[] decoded = Base64.getDecoder().decode(key);
        return Keys.hmacShaKeyFor(decoded);
    }

    public String generateRefreshToken(){
        return UUID
                .randomUUID()
                .toString();
    }

    public RefreshToken saveRefreshToken(UserEntity user){
        RefreshToken refreshToken = RefreshToken
                                .builder()
                                .token(generateRefreshToken())
                                .expiryDate(Instant.now().plusMillis(TimeUnit.DAYS.toMillis(refreshValidity)))
                                .user(user)
                                .build();
        return tokenRepo
                    .save(refreshToken);
    }

    public TokensDto getTokens(UserEntity user){
        return TokensDto
                .builder()
                .accessToken(generateAccessToken(user))
                .refreshToken(saveRefreshToken(user).getToken())
                .build();
    }
}
