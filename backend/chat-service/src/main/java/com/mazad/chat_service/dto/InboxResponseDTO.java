package com.mazad.chat_service.dto;

import java.time.ZonedDateTime;

import lombok.Data;

@Data
public class InboxResponseDTO {
    private String  roomId;
    private long    otherUserId;
    private String  lastMessage;
    private ZonedDateTime timestamp;
}
