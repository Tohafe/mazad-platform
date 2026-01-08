package com.mazad.auth.repo;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mazad.auth.entity.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, UUID> {

}
