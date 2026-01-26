package com.mazad.user_service.mapper;

import org.springframework.stereotype.Component;

import com.mazad.user_service.dto.PrivateResponseDto;
import com.mazad.user_service.dto.PublicResponseDto;
import com.mazad.user_service.dto.RequestDto;
import com.mazad.user_service.entity.ProfileEntity;

@Component
public class ProfileMapper {
    public ProfileEntity toEntity(RequestDto dto){
        return ProfileEntity
                .builder()
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .bio(dto.bio())
                .phoneNumber(dto.phoneNumber())
                .address(dto.address())
                .city(dto.city())
                .country(dto.country())
                .build();
    }

    public PrivateResponseDto toPrivateResponseDto(ProfileEntity entity){
        return PrivateResponseDto
                    .builder()
                    .userName(entity.getUserName())
                    .email(entity.getEmail())
                    .firstName(entity.getFirstName())
                    .lastName(entity.getLastName())
                    .bio(entity.getBio())
                    .avatarUrl(entity.getAvatarUrl())
                    .avatarThambnailUrl(entity.getAvatarThumbnailUrl())
                    .phoneNumber(entity.getPhoneNumber())
                    .address(entity.getAddress())
                    .city(entity.getCity())
                    .country(entity.getCountry())
                    .build();
    }   
    
    public PublicResponseDto toPublicResponseDto(ProfileEntity entity){
        return PublicResponseDto
                .builder()
                .userName(entity.getUserName())
                .bio(entity.getBio())
                .avatarUrl(entity.getAvatarUrl())
                .country(entity.getCountry())
                .build();
    }
}
