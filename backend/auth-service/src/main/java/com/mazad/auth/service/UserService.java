package com.mazad.auth.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.entity.UserEntity;
import com.mazad.auth.exception.DuplicateResourceException;
import com.mazad.auth.exception.UserNotFoundException;
import com.mazad.auth.mapper.UserMapper;
import com.mazad.auth.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {
    private  final  UserRepo repo;
    private  final  UserMapper mapper;

    public List<UserResponseDTO> getAllUsers(){
        List<UserResponseDTO> users;

        users = repo.findAll()
                .stream()
                .map(mapper::toResponseDTO)
                .toList();
        return users;
    }

    public UserResponseDTO getUserById(UUID id){
        UserEntity user = repo
                            .findById(id)
                            .orElseThrow(UserNotFoundException::new);
        return mapper.toResponseDTO(user);
        
    }

    public UserResponseDTO addUser(UserRequestDTO userRequest) {
        UserEntity user = mapper.toEntity(userRequest);

        if (repo.existsByEmail(user.getEmail()))
            throw new DuplicateResourceException("Email is already in use");
        else if (repo.existsByUserName(user.getUserName()))
            throw new DuplicateResourceException("Username is already taken");
            
        user = repo.save(user);
        return mapper.toResponseDTO(user);
    }
}
