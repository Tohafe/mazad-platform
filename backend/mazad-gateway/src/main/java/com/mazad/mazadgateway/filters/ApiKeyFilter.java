package com.mazad.mazadgateway.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.cloud.gateway.filter.ratelimit.RateLimiter;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;


@Component
public class ApiKeyFilter extends AbstractGatewayFilterFactory<ApiKeyFilter.Config> {

    private static final Logger log = LoggerFactory.getLogger(ApiKeyFilter.class);
    @Value("${API_KEY}")
    private String API_KEY;

    public ApiKeyFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            String requestApiKey = exchange.getRequest().getHeaders().getFirst("X-API-KEY");

            if (requestApiKey == null || !requestApiKey.equals(API_KEY)) {
                log.warn("[Auth] Invalid API Key from IP: {}", exchange.getRequest().getRemoteAddress());
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.UNAUTHORIZED);
                return response.setComplete();
            }

            return chain.filter(exchange);
        });
    }

    public static class Config {}
}