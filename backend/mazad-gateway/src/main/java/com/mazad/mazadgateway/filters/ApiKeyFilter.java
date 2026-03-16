package com.mazad.mazadgateway.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Optional;


@Component

public class ApiKeyFilter extends AbstractGatewayFilterFactory<ApiKeyFilter.Config> {

    private static final Logger log = LoggerFactory.getLogger(ApiKeyFilter.class);
    private final ReactiveStringRedisTemplate redisTemplate;

    public ApiKeyFilter(ReactiveStringRedisTemplate redisTemplate) {
        super(Config.class);
        this.redisTemplate = redisTemplate;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            String requestApiKey = exchange.getRequest().getHeaders().getFirst("X-API-KEY");

            if (requestApiKey == null) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            return redisTemplate.opsForValue().get("apikey:" + requestApiKey)
                    .map(Optional::of)
                    .defaultIfEmpty(Optional.empty())
                    .flatMap(optionalUserId -> {
                        if (optionalUserId.isPresent()) {
                            String userId = optionalUserId.get();

                            var mutatedRequest = exchange.getRequest().mutate()
                                    .header("X-User-Id", userId)
                                    .build();
                            var mutatedExchange = exchange.mutate().request(mutatedRequest).build();

                            return chain.filter(mutatedExchange);
                        } else {
                            log.warn("[Auth] Invalid API Key from IP: {}", exchange.getRequest().getRemoteAddress());
                            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        }
                    })
                    .onErrorResume(throwable -> {
                        log.error("[Auth] Redis error while validating API Key from IP {}: {}", 
                                exchange.getRequest().getRemoteAddress(), throwable.getMessage(), throwable);
                        exchange.getResponse().setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
                        return exchange.getResponse().setComplete();
                    });
        });
    }

    public static class Config {
    }
}