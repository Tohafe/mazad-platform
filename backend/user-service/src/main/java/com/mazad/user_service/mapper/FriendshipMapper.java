package com.mazad.user_service.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.mazad.user_service.dto.FriendResponseDto;
import com.mazad.user_service.entity.ProfileEntity;

@Component
public class FriendshipMapper {
    @Value("${user.default.thumbnail}")
    String defaultThumbnail;


    public FriendResponseDto toFriendshipResponseDto(ProfileEntity entity, boolean onlineStatus){

        if (entity.getAvatarThumbnailUrl() != null)
            defaultThumbnail = entity.getAvatarThumbnailUrl();
        return FriendResponseDto
                .builder()
                .username(entity.getUsername())
                .id(entity.getUserId())
                .thumbnail(defaultThumbnail)
                .onlineStatus(onlineStatus)
                .build();
    }
}
