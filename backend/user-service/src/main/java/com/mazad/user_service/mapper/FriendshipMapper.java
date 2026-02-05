package com.mazad.user_service.mapper;

import com.mazad.user_service.dto.FriendResponseDto;
import com.mazad.user_service.entity.ProfileEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FriendshipMapper {
    @Value("${user.default.thumbnail}")
    String defaultThumbnail;


    public FriendResponseDto toFriendshipResponseDto(ProfileEntity entity, boolean onlineStatus){

        if (entity.getAvatarThumbnailUrl() != null)
            defaultThumbnail = entity.getAvatarThumbnailUrl();
        return FriendResponseDto
                .builder()
                .userName(entity.getUserName())
                .thumbnail(defaultThumbnail)
                .onlineStatus(onlineStatus)
                .build();
    }
}
