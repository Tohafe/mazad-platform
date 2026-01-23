package com.mazad.mazadgateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.RequestPath;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;


@Component
public class ApiKeyFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(ApiKeyFilter.class);
    @Value("${API_KEY}")
    private String API_KEY;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String apiKey = exchange.getRequest().getHeaders().getFirst("X-API-KEY");
        if (!checkProtectedPaths(exchange.getRequest().getURI().getPath()))
            return chain.filter(exchange);

        if (apiKey == null || !apiKey.equals(API_KEY)) {
            log.warn("[ApiKeyFilter] API KEY: blocked");
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }
        log.info("[ApiKeyFilter] API KEY: allowed");
        return chain.filter(exchange);
    }
// /api/v1/items/**
// /api/v1/categories/**

    private boolean checkProtectedPaths(String path) {

        return path.startsWith("/api/v1/items") || path.startsWith("/api/v1/categories");
    }

    @Override
    public int getOrder() {
        return 0;
    }
}