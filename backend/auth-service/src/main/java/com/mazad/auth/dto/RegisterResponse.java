package com.mazad.auth.dto;

import java.util.UUID;

public record RegisterResponse(
    UUID id,
    String email,
    String userName,
    String firstName,
    String lastName
) {}
