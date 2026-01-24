package com.mazad.mazadgateway.auth;

import java.util.Base64;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    @Value("${auth.secrets.jwt-secret-key}")
    private String secretKey;

    
    
    public String extractUserId(String token){
        return extractClaim(token, claims -> claims.get("userId", String.class));
    }
    
    private <T> T extractClaim(String token, Function<Claims, T> claimResolver){
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token){
        return Jwts.parser()
            .verifyWith(getSigingKey(secretKey))
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey getSigingKey(String secretKey){
       byte[] key= Base64.getDecoder().decode(secretKey);
       return Keys.hmacShaKeyFor(key);
    }
}
