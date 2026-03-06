package com.mazad.mazadgateway.auth;

import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;


@Component
public class RouterValidator {
    private RouterValidator() {
    }


    private static final Map<String, List<HttpMethod>> openApiEndPoints = Map.ofEntries(
                Map.entry("/api/v1/auth/login", List.of(HttpMethod.POST)),
                Map.entry("/api/v1/auth/register", List.of(HttpMethod.POST)),
                Map.entry("/api/v1/auth/refresh", List.of(HttpMethod.POST)),
                Map.entry("/api/v1/profile/", List.of(HttpMethod.GET)),
                Map.entry("/api/v1/items", List.of(HttpMethod.GET)),
                Map.entry("/api/items", List.of(HttpMethod.GET, HttpMethod.POST,  HttpMethod.PUT, HttpMethod.DELETE)),
                Map.entry("/api/v1/categories", List.of(HttpMethod.GET)),
                Map.entry("/api/v1/catalog", List.of(HttpMethod.GET)),
                Map.entry("/ws", List.of(HttpMethod.GET)),
                Map.entry("/v3/api-docs", List.of(HttpMethod.GET)),
                Map.entry("/docs/", List.of(HttpMethod.GET)),
                Map.entry("/api/v1/bids", List.of(HttpMethod.GET))
    );
    

    private static final List<String> openPaths = List.of(
            "api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/items",
            "/ws"
    );

    public static final Predicate<ServerHttpRequest> isPublicEndpoint =
            request -> openApiEndPoints
                    .entrySet()
                    .stream()
                    .anyMatch(entry ->
                            request.getURI().getPath().contains(entry.getKey())
                                    && entry.getValue().contains(request.getMethod()));

    public static final Predicate<ServerHttpRequest> isPublicPath =
            request -> openPaths
                    .stream()
                    .anyMatch(path -> request.getURI().getPath().contains(path));
}
