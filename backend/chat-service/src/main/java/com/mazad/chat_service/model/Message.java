package com.mazad.chat_service.model;

import lombok.* ;
import jakarta.persistence.*;
import  java.time.ZonedDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;




@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "messages")
@Builder
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID    id;
    
    
    
    @Column(nullable = false)
    private String    roomId;
    
    @Column( nullable = false)
    private UUID    senderId;
   
    @Column(nullable = false)
    private UUID    receiverId;
    
    @Column( nullable = false, columnDefinition = "TEXT")
    private String    content;
    
    @Column(nullable = false)
    @CreationTimestamp
    private ZonedDateTime timestamp;

    @Builder.Default
    @Column(nullable = false)
    private boolean isRead = false;


}
