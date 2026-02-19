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


    private static final Map<String, List<HttpMethod>> openApiEndPoints = Map.of(
            "/api/v1/auth/login", List.of(HttpMethod.POST),
            "/api/v1/auth/register", List.of(HttpMethod.POST),
            "/api/v1/auth/refresh", List.of(HttpMethod.POST),
            "/api/v1/items", List.of(HttpMethod.GET),
            "/api/v1/categories", List.of(HttpMethod.GET),
            "/api/v1/catalog", List.of(HttpMethod.GET)
    );

    private static final List<String> openPaths = List.of(
            "api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh"
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
