package com.mazad.notification.dto;

import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@NoArgsConstructor
public class FriendRequestEvent {
    String targetId;
    String username;
    FriendshipStatus status;
}
