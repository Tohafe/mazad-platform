package com.mazad.mazadgateway.config;


import com.mazad.mazadgateway.filters.CommonFilters;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import reactor.core.publisher.Mono;

/*
 * =================================================================================
 * THE 3 PILLARS OF SPRING CLOUD GATEWAY
 * =================================================================================
 * * 1. ROUTE (The "Map")
 * - The basic building block of the gateway.
 * - It consists of an ID, a destination URI, a collection of predicates,
 * and a collection of filters.
 * - If the "Predicate" is true, the request is sent to the "URI".
 *
 * 2. PREDICATE (The "Guard")
 * - The logic that checks if a request matches a route.
 * - Based on Java 8 Function Predicate.
 * - You can match on anything in the HTTP request: Path, Header, Method,
 * Time, Cookie, or Host.
 * - Example: "Is the path /api/v1/items?" OR "Is the method POST?"
 *
 * 3. FILTER (The "Modifier")
 * - The logic that runs before or after the request is sent to the service.
 * - Pre-Filter: Modify the request (add headers, strip path) before sending.
 * - Post-Filter: Modify the response (add security headers, log time)
 * before returning to the user.
 * =================================================================================
 */
@Configuration
public class GatewayConfig {

    @Bean
    public KeyResolver resolveKey() {
        return (exchange) -> {
            String apiKey = exchange.getRequest().getHeaders().getFirst("X-API-KEY");
            System.out.println("CLIENT API KEY: " + apiKey);
            return Mono.justOrEmpty(apiKey);
        };
    }

}


