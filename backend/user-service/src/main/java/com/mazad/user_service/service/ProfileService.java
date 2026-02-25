package com.mazad.user_service.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mazad.user_service.dto.CurrentUser;
import com.mazad.user_service.dto.PrivateResponseDto;
import com.mazad.user_service.dto.PublicResponseDto;
import com.mazad.user_service.dto.RequestDto;
import com.mazad.user_service.entity.ProfileEntity;
import com.mazad.user_service.exception.BadRequestException;
import com.mazad.user_service.exception.ProfileAlreadyExistException;
import com.mazad.user_service.exception.ResourceNotFoundException;
import com.mazad.user_service.mapper.ProfileMapper;
import com.mazad.user_service.repo.ProfileRepo;
import com.mazad.user_service.validation.ProfilePatchValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final ProfileRepo repo;
    private final ProfileMapper mapper;
    private final JsonMapper jsonMapper;


    public PrivateResponseDto getPrivateProfile(UUID userId) {
        ProfileEntity profile = repo
                .findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile Not Found"));
        return mapper.toPrivateResponseDto(profile);
    }

    public PublicResponseDto getPublicProfile(String username) {
        ProfileEntity profile = repo
                .findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        return mapper.toPublicResponseDto(profile);
    }

    public PrivateResponseDto addProfile(CurrentUser user, RequestDto requestDto) {
        repo.findByUserId(user.id()).ifPresent((profile) -> {
            if(profile.isComplete())
                throw new ProfileAlreadyExistException();
        });
        ProfileEntity profile = mapper.toEntity(requestDto);
        profile.setUserId(user.id());
        profile.setEmail(user.email());
        profile.setUsername(user.username());

        if (isAvatarValid(requestDto.avatarImageId(), requestDto.avatarUrl(), requestDto.avatarThumbnailUrl())) {
            profile.setAvatarUrl(requestDto.avatarUrl());
            profile.setAvatarImageId(requestDto.avatarImageId());
            profile.setAvatarThumbnailUrl(requestDto.avatarThumbnailUrl());
        }
        profile.setComplete(true);
        profile = repo.save(profile);
        return mapper.toPrivateResponseDto(profile);
    }

    private boolean isAvatarValid(String avatarId, String avatarUrl, String thumbnail) {
        return avatarId != null && !avatarId.isBlank() && avatarUrl != null && !avatarUrl.isBlank() && thumbnail != null && !thumbnail.isBlank();
    }

    public PrivateResponseDto patch(UUID userId, ObjectNode jsonNode, boolean isInternal) {
        ProfileEntity profile = new ProfileEntity();

        if (!isInternal){
            ProfilePatchValidator.validate(jsonNode);
            profile = repo
                    .findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Profile Not Found"));
            if (!profile.isComplete())
                throw new BadRequestException("The profile should be completed first with Post request");
        }
        jsonMapper.readerForUpdating(profile).readValue(jsonNode);
        profile = repo.save(profile);
        return mapper.toPrivateResponseDto(profile);
    }

    @Transactional
    public void deleteProfile(UUID userId) {
        if (repo.existsByUserId(userId))
            repo.deleteByUserId(userId);
    }
}
