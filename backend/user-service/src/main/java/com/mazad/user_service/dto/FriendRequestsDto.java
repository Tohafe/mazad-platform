package com.mazad.user_service.dto;

import lombok.Builder;

@Builder
public record FriendRequestsDto(
        String username,
        String thumbnail,
        String status
) {}
