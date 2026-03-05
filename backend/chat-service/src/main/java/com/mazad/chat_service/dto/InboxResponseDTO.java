package com.mazad.chat_service.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

import lombok.Data;

@Data
public class InboxResponseDTO {
    private String  roomId;
    private UUID    otherUserId;
    private String  lastMessage;
    private ZonedDateTime timestamp;
    private boolean         hasUnreadMessages;
}
