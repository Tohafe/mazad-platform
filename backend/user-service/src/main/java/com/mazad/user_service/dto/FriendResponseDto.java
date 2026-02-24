package com.mazad.user_service.dto;

import lombok.Builder;

@Builder
public record FriendResponseDto(
        String username,
        String thumbnail,
        boolean onlineStatus
) {}
