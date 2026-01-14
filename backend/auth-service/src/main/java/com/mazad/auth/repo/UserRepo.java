package com.mazad.auth.repo;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mazad.auth.entity.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, UUID> {
    boolean existsByEmail(String email);
    boolean existsByUserName(String userName);
    Optional<UserEntity> findByEmail(String email);
}
