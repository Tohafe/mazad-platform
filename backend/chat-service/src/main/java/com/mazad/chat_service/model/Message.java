package com.mazad.chat_service.model;

import lombok.* ;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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
    private String    roomId;
    
    @Column( nullable = false)
    private UUID    senderId;
   
    @Column(nullable = false)
    private UUID    receiverId;
    

    @Size(max = 500, message = "message content is too long!")
    @NotBlank( message = "content connot be empty !")
    @Column( nullable = false, columnDefinition = "TEXT")
    private String    content;
    
    @Column(nullable = false)
    @CreationTimestamp
    private ZonedDateTime timestamp;



}