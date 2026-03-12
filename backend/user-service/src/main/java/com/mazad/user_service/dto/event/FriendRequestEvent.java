package com.mazad.user_service.dto.event;

import java.util.UUID;

import com.mazad.user_service.enums.FriendshipStatus;

import lombok.Builder;

@Builder
public record FriendRequestEvent(
    UUID targetId,
    String username,
    FriendshipStatus status
){}
