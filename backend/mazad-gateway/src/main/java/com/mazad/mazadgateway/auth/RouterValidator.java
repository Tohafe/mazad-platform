package com.mazad.mazadgateway.auth;

import java.util.List;
import java.util.function.Predicate;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

@Component
public class RouterValidator {
    private RouterValidator() {
    }

    public static final List<String> openApiEndPoints = List.of(
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/v1/items"
    );

    public static final Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndPoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));
}
