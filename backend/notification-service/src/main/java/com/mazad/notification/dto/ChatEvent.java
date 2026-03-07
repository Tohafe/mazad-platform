package com.mazad.notification.dto;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import lombok.Data;


@Data
@NoArgsConstructor
public class ChatEvent {
    private String            id;
    private String          roomId;
    private String            senderId;
    private String            receiverId;
    private String          content;
    private ZonedDateTime   timestamp;
}
