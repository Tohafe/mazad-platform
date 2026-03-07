package com.mazad.notification.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.Instant;
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

    @Column(nullable = true)
    private String targetUrl;

    @Builder.Default
    private boolean isRead = false;


private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
    
}
