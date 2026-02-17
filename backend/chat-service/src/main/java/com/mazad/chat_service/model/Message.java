package com.mazad.chat_service.model;

import lombok.* ;
import jakarta.persistence.*;

import  java.time.ZonedDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;




@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "messages")
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID    id;
    
    
    
    @Column(nullable = false)
    private long    chatId;
    
    @Column( nullable = false)
    private long    senderId;
   
    @Column(nullable = false)
    private long    receiverId;
    
    @Column( nullable = false, columnDefinition = "TEXT")
    private String    content;
    
    @Column(nullable = false)
    @CreationTimestamp
    private ZonedDateTime timestamp;



}