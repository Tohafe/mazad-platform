package com.mazad.user_service.dto;

import lombok.Builder;

@Builder
public record  PublicResponseDto(
    String username,
    String bio,
    String avatarUrl,
    String thumbnail,
    String country
) {}
