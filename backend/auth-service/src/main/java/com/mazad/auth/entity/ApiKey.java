package com.mazad.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "api_keys")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "api_key", unique = true, nullable = false)
    private String apiKey;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private Instant createdAt;

}