package com.mazad.auth.mapper;
 
import org.springframework.stereotype.Component;

import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.entity.UserEntity;

@Component
public class UserMapper {
    public UserEntity toEntity(UserRequestDTO request){
        return UserEntity.builder()
                            .email(request.email())
                            .password(request.password())
                            .userName(request.userName())
                            .firstName(request.firstName())
                            .lastName(request.lastName())
                            .build();
    }

    public UserResponseDTO toResponseDTO(UserEntity userEntity){
        return UserResponseDTO.builder()
                                    .id(userEntity.getId())
                                    .email(userEntity.getEmail())
                                    .userName(userEntity.getUserName())
                                    .firstName(userEntity.getFirstName())
                                    .lastName(userEntity.getLastName())
                                    .build();
    }
}
