package com.mazad.user_service.dto;

import java.util.UUID;

import lombok.Builder;

@Builder
public record  CurrentUser (
    UUID id,
    String email,
    String username,
    String firstName,
    String lastName,
    String avatarImageId,
    String avatarUrl,
    String avatarThumbnailUrl,
    String balance
) {}
