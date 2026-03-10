package com.mazad.user_service.dto;

import lombok.Builder;

@Builder
public record PrivateResponseDto(
    String id,
    String username,
    String email,
    String firstName,
    String lastName,
    String bio,
    String avatarUrl,
    String avatarThumbnailUrl,
    String avatarImageId,
    String phoneNumber,
    String address,
    String city,
    String country,
    boolean isComplete
) {}
