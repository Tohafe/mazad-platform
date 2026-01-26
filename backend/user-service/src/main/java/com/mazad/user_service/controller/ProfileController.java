package com.mazad.user_service.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.user_service.dto.CurrentUser;
import com.mazad.user_service.dto.PrivateResponseDto;
import com.mazad.user_service.dto.PublicResponseDto;
import com.mazad.user_service.dto.RequestDto;
import com.mazad.user_service.exception.BadRequestException;
import com.mazad.user_service.service.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;



@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService service;
    private final ObjectMapper mapper;

    @GetMapping
    public ResponseEntity<PrivateResponseDto> getPrivateProfile(@RequestHeader(name="X-User-Id") UUID userId) {
        PrivateResponseDto response = service.getPrivateProfile(userId);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userName}")
    public ResponseEntity<PublicResponseDto> getPublicProfile(@PathVariable("userName") String userName) {
        PublicResponseDto response = service.getPublicProfile(userName);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<PrivateResponseDto> addProfile(
        @RequestHeader(name="X-User-Id") UUID userId,
        @RequestHeader(name="X-User-Email") String email,
        @RequestHeader(name="X-User-Name") String userName,
        @RequestBody @Valid RequestDto requestDto
    ){
        CurrentUser user = CurrentUser
                            .builder()
                            .id(userId)
                            .email(email)
                            .userName(userName)
                            .build();
        PrivateResponseDto response = service.addProfile(user, requestDto);
        return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(response);
    }

    @PatchMapping
    public ResponseEntity<PrivateResponseDto> editProfile(
        @RequestHeader(name="X-User-Id") UUID userId,
        @RequestBody ObjectNode jsonNode
    ){
        jsonNode.remove(List.of("userId", "userName", "email", "isComplete"));
        if (jsonNode.isEmpty())
                throw new BadRequestException("No data provided");
        PrivateResponseDto response = service.patch(userId, jsonNode);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("internal/sync")
    public void syncAuthData(
        @RequestHeader(name="User-Auth-Sync-Key") String key,
        @RequestBody CurrentUser userData
    ){
        ObjectNode node = mapper.createObjectNode();

        if (userData.email() != null && !userData.email().isBlank())
            node.put("email", userData.email());
        if (userData.userName() != null && !userData.userName().isBlank())
            node.put("userName", userData.userName());
        service.patch(userData.id(), node);
    }

    @DeleteMapping("internal/sync")
    public void syncAuthData(
        @RequestHeader(name="User-Auth-Sync-Key") String key,
        @RequestBody UUID userId
    ){
        service.deleteProfile(userId);
    }

}
