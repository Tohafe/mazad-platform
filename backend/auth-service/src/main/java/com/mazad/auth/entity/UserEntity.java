package com.mazad.auth.entity;

import java.time.Instant;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
public class UserEntity implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique=true, nullable=false)
    private String email;

    @Column(nullable=false)
    private String password;

    @Column(name="username", unique=true, nullable=false, length=15)
    private String userName;

    @Column(name="is_2fa_enabled")
    @Builder.Default
    private boolean twoFaEnabled = false;

    @Column(name="is_verified")
    @Builder.Default
    private boolean verified = false;

    @CreationTimestamp
    @Column(name="created_at", updatable=false, nullable=false)
    private Instant  createdAt;

    @UpdateTimestamp
    @Column(name="updated_at", nullable=false)
    private Instant    updatedAt;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getUsername() {
       return this.email;
    }
    
    public String getUserName() {
       return this.userName;
    }

    @Override
    public boolean isEnabled() {
		return true;
	}
}
