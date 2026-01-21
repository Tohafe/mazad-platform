package com.mazad.auth.dto;

import lombok.Builder;

@Builder
public record AuthResponseDto(
    String refreshToken,
    String accessToken,
    UserResponseDTO user
) {}
