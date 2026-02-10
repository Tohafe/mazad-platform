package com.mazad.user_service.dto;

import lombok.Builder;

@Builder
public record FriendRequestsDto(
        String userName,
        String thumbnail,
        String status
) {}
