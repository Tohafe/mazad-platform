package com.mazad.mazadgateway.filters;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Component
@RequiredArgsConstructor
@Slf4j
public class OnlineStatusFilter implements GlobalFilter, Ordered {
    private final ReactiveStringRedisTemplate redisTemplate;

    @Override
    public int getOrder() {
        return 5;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");

        if (userId != null) {
            String key = "user:online:" + userId;

            return redisTemplate.opsForValue()
                    .set(key, "1", Duration.ofMinutes(2))
                    .flatMap(result -> chain.filter(exchange))
                    .onErrorResume(e -> {
                        log.error("Redis is down, skipping online status update: {}", e.getMessage());
                        return chain.filter(exchange);
                    });
        }
        return chain.filter(exchange);
    }
}