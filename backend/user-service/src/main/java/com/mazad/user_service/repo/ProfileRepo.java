package com.mazad.user_service.repo;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mazad.user_service.entity.ProfileEntity;


public interface ProfileRepo extends JpaRepository<ProfileEntity, UUID>{
    public Optional<ProfileEntity> findByUserId(UUID userId);
    public Optional<ProfileEntity> findByUserName(String userName);
    public boolean                  existsByUserId(UUID userId);
    public void                     deleteByUserId(UUID userId);
}
