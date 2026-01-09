package com.mazad.auth.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.entity.UserEntity;
import com.mazad.auth.exception.DuplicateResourceException;
import com.mazad.auth.mapper.UserMapper;
import com.mazad.auth.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {
    private  final  UserRepo repo;
    private  final  UserMapper mapper;

    public List<UserResponseDTO> getAll(){
        List<UserResponseDTO> users;

        users = repo.findAll()
                .stream()
                .map(entity -> mapper.toResponseDTO(entity))
                .toList();
        return users;
    }

    public UserResponseDTO addUser(UserRequestDTO userRequest) {
        UserEntity user = UserEntity.builder()
                                    .email(userRequest.email())
                                    .password(userRequest.password())
                                    .userName(userRequest.userName())
                                    .firstName(userRequest.firstName())
                                    .lastName(userRequest.lastName())
                                    .build();
        if (repo.existsByEmail(user.getEmail()))
            throw new DuplicateResourceException("Email is already in use");
        else if (repo.existsByUserName(user.getUserName()))
            throw new DuplicateResourceException("Username is already taken");
            
        user = repo.save(user);
        return UserResponseDTO.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .userName(user.getUserName())
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .build();
    }
}
