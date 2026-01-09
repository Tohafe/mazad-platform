package com.mazad.auth.mapper;
 
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.entity.UserEntity;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final PasswordEncoder passwordEncoder;

    public UserEntity toEntity(UserRequestDTO request){
        if (request == null)
            return null;
        String passwordHash;

        passwordHash = passwordEncoder.encode(request.password());
        return UserEntity.builder()
                            .email(request.email())
                            .password(passwordHash)
                            .userName(request.userName())
                            .firstName(request.firstName())
                            .lastName(request.lastName())
                            .build();
    }

    public UserResponseDTO toResponseDTO(UserEntity userEntity){
        if (userEntity == null)
            return null;
        return UserResponseDTO.builder()
                                    .id(userEntity.getId())
                                    .email(userEntity.getEmail())
                                    .userName(userEntity.getUserName())
                                    .firstName(userEntity.getFirstName())
                                    .lastName(userEntity.getLastName())
                                    .build();
    }
}
