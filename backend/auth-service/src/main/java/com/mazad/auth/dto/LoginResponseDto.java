package com.mazad.auth.dto;

import lombok.Builder;

@Builder
public record  LoginResponseDto (
    String accessToken,
    UserResponseDTO user
) {}
