package com.mazad.user_service.dto;

import java.util.UUID;

import com.mazad.user_service.enums.FriendshipStatus;

import lombok.Builder;

@Builder
public record FriendDto(
    UUID requesterId,
    FriendshipStatus status
){}