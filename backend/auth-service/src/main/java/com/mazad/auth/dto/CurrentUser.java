package com.mazad.auth.dto;

import lombok.Builder;

import java.util.UUID;

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
