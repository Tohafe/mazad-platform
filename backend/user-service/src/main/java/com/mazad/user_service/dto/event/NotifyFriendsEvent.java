package com.mazad.user_service.dto.event;

import java.util.List;
import java.util.UUID;

import lombok.Builder;

@Builder
public record NotifyFriendsEvent(
    Long auctionId,
    String username,
    List<UUID> friendIds,
    boolean isDelete
) {}
