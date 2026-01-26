package com.mazad.user_service.dto;

import lombok.Builder;

@Builder
public record PrivateResponseDto(
    String userName,
    String email,
    String firstName,
    String lastName,
    String bio,
    String avatarUrl,
    String avatarThambnailUrl,
    String phoneNumber,
    String address,
    String city,
    String country
) {}
