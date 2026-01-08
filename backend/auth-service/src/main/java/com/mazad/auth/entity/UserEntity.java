package com.mazad.auth.entity;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Email
    @Column(unique=true, nullable=false)
    private String email;

    @Column(nullable=false)
    private String password;

    @Column(unique=true, nullable=false, length=15)
    private String username;

    @Column(name="first_name", nullable=false, length=15)
    private String firstName;

    @Column(name="last_name",nullable=false, length=15)
    private String lastName;

    @Column(name="is_2fa_enabled")
    @Builder.Default
    private boolean twoFaEnabled = false;

    @Column(name="is_verified")
    @Builder.Default
    private boolean verified = false;

    @CreationTimestamp
    @Column(name="created_at", updatable=false, nullable=false)
    private OffsetDateTime  createdAt;

    @UpdateTimestamp
    @Column(name="updated_at", nullable=false)
    private OffsetDateTime    updatedAt;
}
