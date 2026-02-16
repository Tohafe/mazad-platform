package src.main.java.com.mazad.chat_service.model;

import lombok.* ;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;




@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "message")
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID    id;
    
    
    
    @Column(nullable = false)
    private long    chatId;
    
    @Column(nullable = false)
    private long    senderId;
   
    @Column(nullable = false)
    private long    receiverId;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String    content;
    
    @Column(nullable = false)
    private LocalDateTime   timestamp;

}