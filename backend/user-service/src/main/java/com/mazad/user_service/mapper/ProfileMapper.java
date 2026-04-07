package com.mazad.user_service.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.mazad.user_service.dto.PrivateResponseDto;
import com.mazad.user_service.dto.PublicResponseDto;
import com.mazad.user_service.dto.RequestDto;
import com.mazad.user_service.dto.UserSummaryDto;
import com.mazad.user_service.entity.ProfileEntity;

@Component
public class ProfileMapper {
    @Value("${user.default.avatar}")
    String defaultAvatar;
    @Value("${user.default.thumbnail}")
    String defaultThumbnail;

    public ProfileEntity toEntity(RequestDto dto) {
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
        if (entity.getAvatarUrl() == null || entity.getAvatarUrl().isBlank()){
            entity.setAvatarUrl(defaultAvatar);
        }
        if (entity.getAvatarThumbnailUrl() == null || entity.getAvatarThumbnailUrl().isBlank()){
            entity.setAvatarThumbnailUrl(defaultThumbnail);
        }
        return PrivateResponseDto
                    .builder()
                    .id(entity.getUserId().toString())
                    .username(entity.getUsername())
                    .email(entity.getEmail())
                    .firstName(entity.getFirstName())
                    .lastName(entity.getLastName())
                    .bio(entity.getBio())
                    .avatarUrl(entity.getAvatarUrl())
                    .avatarThumbnailUrl(entity.getAvatarThumbnailUrl())
                    .avatarImageId(entity.getAvatarImageId())
                    .phoneNumber(entity.getPhoneNumber())
                    .address(entity.getAddress())
                    .city(entity.getCity())
                    .country(entity.getCountry())
                    .isComplete(entity.isComplete())
                    .build();
    }   
    
    public PublicResponseDto toPublicResponseDto(ProfileEntity entity){
        if (entity.getAvatarUrl() == null){
            entity.setAvatarUrl(defaultAvatar);
            entity.setAvatarThumbnailUrl(defaultThumbnail);
        }
        return PublicResponseDto
                .builder()
                .username(entity.getUsername())
                .userId(entity.getUserId().toString())
                .bio(entity.getBio())
                .avatarUrl(entity.getAvatarUrl())
                .thumbnail(entity.getAvatarThumbnailUrl())
                .country(entity.getCountry())
                .build();
    }

    public UserSummaryDto toUserSummaryDto(ProfileEntity entity){
        if (entity.getAvatarUrl() == null || entity.getAvatarUrl().isBlank()){
            entity.setAvatarUrl(defaultAvatar);
        }
        return UserSummaryDto
        .builder()
        .username(entity.getUsername())
        .firstName(entity.getFirstName())
        .lastName(entity.getLastName())
        .avatarUrl(entity.getAvatarUrl())
        .build();
    }
}
