package com.mazad.mazadgateway.auth;


import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;


@RequiredArgsConstructor
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered{

    private final JwtUtil           jwtUtil;
    private final ObjectMapper      mapper;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest  request = exchange.getRequest();

        if (RouterValidator.isPublicEndpoint.test(request)){
            return chain.filter(exchange);
        }
        if (RouterValidator.isPublicPath.test(request)){
            return onError(exchange, "Method Not Allowed For This Path", HttpStatus.METHOD_NOT_ALLOWED);
        }
            
        if (isAuthMissing(request))
            return onError(exchange, "Authorization header is missing", HttpStatus.UNAUTHORIZED);
        String token = getAccessToken(request);

        if (token == null || token.isEmpty() || !token.startsWith("Bearer "))
            return onError(exchange, "Invalid Access Token", HttpStatus.UNAUTHORIZED);
        token = token.substring(7);

        try {
            ServerHttpRequest modifiedRequest = request
                                                    .mutate()
                                                    .header("X-User-Id", jwtUtil.extractUserId(token))
                                                    .header("X-User-Email", jwtUtil.extractEmail(token))
                                                    .header("X-User-Name", jwtUtil.extractUserName(token))
                                                    .build();
            return chain.filter(exchange.mutate().request(modifiedRequest).build());
            
        } catch (ExpiredJwtException e) {
            return onError(exchange, "Token has expired", HttpStatus.UNAUTHORIZED);
        }catch (Exception e){
            return onError(exchange, "Invalid Access Token", HttpStatus.UNAUTHORIZED);
        }
    }
    
    
    private boolean isAuthMissing(ServerHttpRequest request){
        return !request.getHeaders().containsHeader(HttpHeaders.AUTHORIZATION);
    }

    private String getAccessToken(ServerHttpRequest request){
        return request
                    .getHeaders()
                    .getFirst(HttpHeaders.AUTHORIZATION);
    }


    private Mono<Void> onError(ServerWebExchange exchange, String errMessage, HttpStatus status){
        ServerHttpResponse response;
        Map<String, Object> errorDetails = new HashMap<>();
        
        response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        
        errorDetails.put("timestamp", Instant.now().toString());
        errorDetails.put("status", status.value());
        errorDetails.put("error", status.getReasonPhrase());
        errorDetails.put("message", errMessage);
        errorDetails.put("path", exchange.getRequest().getPath().toString());
        
        try{
            byte[] errorBytes = mapper.writeValueAsBytes(errorDetails);
            DataBuffer buffer = response.bufferFactory().wrap(errorBytes);
            return response.writeWith(Mono.just(buffer));
            
        }catch(JacksonException e){
            response.setComplete();
        }
        
        return response.setComplete();
    }


    @Override
    public int getOrder(){
        return -1;
    }
}
