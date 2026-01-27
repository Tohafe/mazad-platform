package com.mazad.user_service.dto;

import lombok.Builder;

@Builder
public record  PublicResponseDto(
    String userName,
    String bio,
    String avatarUrl,
    String country
) {}
