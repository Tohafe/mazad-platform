package com.mazad.user_service.dto;

import java.util.UUID;

import lombok.Builder;

@Builder
public record FriendResponseDto(
        String  username,
        String  thumbnail,
        UUID    id,
        boolean onlineStatus
) {}
