package com.mazad.chat_service.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

import lombok.Data;



@Data
public class MessageChateventDTO {
    private UUID            id;
    private String          roomId;
    private long            senderId;
    private long            receiverId;
    private String          content;
    private ZonedDateTime   timestamp;
}
