package com.mazad.user_service.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record AvatarDto(
    @NotBlank(message="Invalid Image Id")
    UUID avatarImageId,

    @NotBlank(message="Invalid Image Url")
    String avatarUrl,
    @NotBlank(message="Invalid Image Thumbnail Url")
    String avatarThumbnailUrl
) {}
