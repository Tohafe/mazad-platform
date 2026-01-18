package com.mazad.mazadgateway;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

class MazadFilters {

    public static GatewayFilter logger() {
        return ((exchange, chain) -> {
            System.out.println("A request is arrived at: " + LocalDateTime.now());
            return chain.filter(exchange);
        });
    }

    public static GatewayFilter sleep(int seconds) {
        return ((exchange, chain) ->
                Mono.delay(Duration.of(seconds, ChronoUnit.SECONDS))
                        .then(chain.filter(exchange)));
    }

    public static GatewayFilter totalTime() {
        return ((exchange, chain) -> {
            var startTime = System.currentTimeMillis();
            return chain.filter(exchange)
                    .then(Mono.fromRunnable(() -> {
                        var totalTime = System.currentTimeMillis() - startTime;
                        exchange.getResponse().getHeaders().add("Total-Time", String.valueOf(totalTime));
                    }));
        });
    }
}