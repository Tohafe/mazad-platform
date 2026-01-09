package com.mazad.auth.dto;

import java.util.UUID;

import lombok.Builder;

@Builder
public record UserResponseDTO(
    UUID id,
    String email,
    String userName,
    String firstName,
    String lastName
) {}
