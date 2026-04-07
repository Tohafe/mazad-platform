package com.mazad.user_service.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.user_service.dto.AvatarDto;
import com.mazad.user_service.dto.CurrentUser;
import com.mazad.user_service.dto.PrivateResponseDto;
import com.mazad.user_service.dto.PublicResponseDto;
import com.mazad.user_service.dto.RequestDto;
import com.mazad.user_service.dto.UserSummaryDto;
import com.mazad.user_service.exception.BadRequestException;
import com.mazad.user_service.service.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.node.ObjectNode;


@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService service;

    @GetMapping
    public ResponseEntity<PrivateResponseDto> getPrivateProfile(@RequestHeader(name = "X-User-Id") UUID userId) {
        PrivateResponseDto response = service.getPrivateProfile(userId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{username}")
    public ResponseEntity<PublicResponseDto> getPublicProfile(@PathVariable("username") String username) {
        PublicResponseDto response = service.getPublicProfile(username, false);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<PublicResponseDto> getPublicProfileByID(@PathVariable("userId") String userId) {
        PublicResponseDto response = service.getPublicProfile(userId, true);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<PrivateResponseDto> addProfile(
            @RequestHeader(name = "X-User-Id") UUID userId,
            @RequestHeader(name = "X-User-Email") String email,
            @RequestHeader(name = "X-User-Name") String username,
            @RequestBody @Valid RequestDto requestDto
    ) {
        CurrentUser user = CurrentUser
                .builder()
                .id(userId)
                .email(email)
                .username(username)
                .build();
        PrivateResponseDto response = service.addProfile(user, requestDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/avatar")
    public ResponseEntity<PrivateResponseDto> editAvatar(@Valid @RequestBody AvatarDto dto, @RequestHeader(name = "X-User-Id") UUID userId){
        PrivateResponseDto response;
        
        response = service.changeAvatar(dto, userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping
    public ResponseEntity<PrivateResponseDto> editProfile(
            @RequestHeader(name = "X-User-Id") UUID userId,
            @RequestBody ObjectNode jsonNode
    ) {
        jsonNode.remove(List.of("userId", "username", "email", "isComplete"));
        if (jsonNode.isEmpty())
            throw new BadRequestException("No data provided");
        PrivateResponseDto response = service.patch(userId, jsonNode, false);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDto>> getAllUsers(@RequestParam(name = "password", required = false) String password) {
        List<UserSummaryDto> users = service.getAllUsers(password);
        return ResponseEntity.ok(users);
    }

}
