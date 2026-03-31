package com.mazad.chat_service.dto;

import java.time.ZonedDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MessageResponseDTO {
    private UUID    id;
    private UUID    senderId;
    private String    content;
    private ZonedDateTime timestamp;    
}
