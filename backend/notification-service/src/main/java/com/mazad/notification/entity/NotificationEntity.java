package com.mazad.notification.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;



@Entity
@Table(name = "notifications") 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Long id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private String type; 

    @Builder.Default
    private boolean isRead = false;

    // This ensures the timestamp is set automatically by Java before saving
private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
}
