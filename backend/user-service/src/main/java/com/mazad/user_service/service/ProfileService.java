package com.mazad.user_service.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mazad.user_service.dto.AvatarDto;
import com.mazad.user_service.dto.CurrentUser;
import com.mazad.user_service.dto.PatchDto;
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
    private final ProfilePatchValidator patchValidator;


    public PrivateResponseDto getPrivateProfile(UUID userId) {
        ProfileEntity profile = repo
                .findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile Not Found"));
                return mapper.toPrivateResponseDto(profile);
            }
            
    public PublicResponseDto getPublicProfile(String identifier, boolean isId) {
        ProfileEntity profile;
        if (!isId){
            profile = repo
            .findByUsername(identifier)
            .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        }
        else{
            profile = repo
                .findByUserId(UUID.fromString(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        }
        return mapper.toPublicResponseDto(profile);
    }

    public PrivateResponseDto addProfile(CurrentUser user, RequestDto requestDto) {
        ProfileEntity oldProfile ;
        if (repo.findByUserId(user.id()).isPresent())
            oldProfile = repo.findByUserId(user.id()).get();
        else
            oldProfile = null;
        if(oldProfile != null && oldProfile.isComplete())
            throw new ProfileAlreadyExistException();
        ProfileEntity profile = mapper.toEntity(requestDto);

        profile.setUserId(user.id());
        profile.setEmail(user.email());
        profile.setUsername(user.username());
        profile.setComplete(true);

        if (oldProfile != null && oldProfile.getAvatarImageId() != null) {
            profile.setAvatarImageId(oldProfile.getAvatarImageId());
            profile.setAvatarUrl(oldProfile.getAvatarUrl());
            profile.setAvatarThumbnailUrl(oldProfile.getAvatarThumbnailUrl());
        }

        profile = repo.save(profile);

        return mapper.toPrivateResponseDto(profile);
    }

    public PrivateResponseDto patch(UUID userId, ObjectNode jsonNode, boolean isInternal) {
        ProfileEntity profile = null;

        if (!isInternal){
            PatchDto dto = new PatchDto();
            jsonMapper.readerForUpdating(dto).readValue(jsonNode);
            patchValidator.validate(jsonNode, dto);

            profile = repo
                    .findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
            if (!profile.isComplete())
                throw new BadRequestException("The profile should be completed first with Post request");
        }
        if (profile == null){
            profile = repo
                .findByUserId(userId)
                .orElse(new ProfileEntity());
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
    
    public PrivateResponseDto changeAvatar(AvatarDto dto, UUID userId) {
        ProfileEntity profile = repo
                .findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        profile.setAvatarUrl(dto.avatarUrl());
        profile.setAvatarImageId(dto.avatarImageId());
        profile.setAvatarThumbnailUrl(dto.avatarThumbnailUrl());
        profile = repo.save(profile);
        return mapper.toPrivateResponseDto(profile);
    }
}
