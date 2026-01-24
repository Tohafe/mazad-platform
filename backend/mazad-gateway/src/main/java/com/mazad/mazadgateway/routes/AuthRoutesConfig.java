package com.mazad.mazadgateway.routes;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthRoutesConfig {

    @Bean
    public RouteLocator authRouteLocator(RouteLocatorBuilder routeBuilder){
        return routeBuilder.routes()
                            .route("auth-service-route", r -> r
                                    .path("/api/v1/auth/**")
                                    .filters(f -> f.stripPrefix(2))
                                    .uri("http://auth-service:9000")
                            )
                            .build();
    }
}
