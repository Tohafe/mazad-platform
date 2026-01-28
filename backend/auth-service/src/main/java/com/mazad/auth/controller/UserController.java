package com.mazad.auth.controller;

import java.time.Duration;
import java.util.UUID;

import com.mazad.auth.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.auth.dto.AuthResponseDto;
import com.mazad.auth.dto.EmailResetDto;
import com.mazad.auth.dto.LoginResponseDto;
import com.mazad.auth.dto.PasswordResetDto;
import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.JsonNode;


@RestController
@RequestMapping("/auth/")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    public final UserService userService;

    @Value("${auth.refresh-token-validity-days:4}")
    long    refreshValidity;

    @PostMapping("register")
    public UserResponseDTO adddUser(
        @RequestBody @Validated(UserRequestDTO.OnRegister.class) UserRequestDTO userRequest
    ) {
        return userService.addUser(userRequest);
    }

    @PostMapping("login")
    public ResponseEntity<LoginResponseDto> userLogin(
        @RequestBody @Validated(UserRequestDTO.OnLogin.class) UserRequestDTO userRequest,
        @CookieValue(name="refresh_token", required=false) String refreshToken
    ) {
        AuthResponseDto authResponse;
        ResponseCookie refreshCookie;
        LoginResponseDto loginResponse;


        authResponse = userService.verifyUser(userRequest, refreshToken);
        refreshCookie = ResponseCookie
                            .from("refresh_token", authResponse.refreshToken())
                            .httpOnly(true)
                            .sameSite("Strict")
                            .secure(false) // true for HTTPS on production
                            .path("/api/v1/auth/")
                            .maxAge(Duration.ofDays(refreshValidity))
                            .build();
        loginResponse = LoginResponseDto
                            .builder()
                            .accessToken(authResponse.accessToken())
                            .user(authResponse.user())
                            .build();

        return ResponseEntity
                        .ok()
                        .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                        .body(loginResponse);
    }
    
    @PostMapping("logout")
    public ResponseEntity<String> userLogout(
        @CookieValue(name = "refresh_token", required=false) String refreshToken
    ){
        ResponseCookie refreshCookie;

        if (refreshToken != null)
            userService.logout(refreshToken);
        refreshCookie = ResponseCookie.from("refresh_token", "")
                            .maxAge(0)
                            .build();
        return ResponseEntity
                            .ok()
                            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                            .body("User Logout");
    }

    @PostMapping("refresh")
    public String  refresh(
        @CookieValue(name="refresh_token", required=false) String refreshToken
    ){
        return userService.refresh(refreshToken);
    }
    
    @DeleteMapping("delete")
    public ResponseEntity<String> delete(
        @RequestHeader(name="X-User-Id") UUID userId,
        @RequestBody JsonNode passNode
    ){
        String password;
        if (!passNode.has("password"))
            throw new BadRequestException("Password Required!");
        password = passNode.get("password").asString();
        if (password == null || password.isBlank())
            throw new BadRequestException("Password Can't Be Empty!");
        userService.delete(userId, passNode.get("password").asString());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Deleted");
    }

    @PatchMapping("reset/password")
    public ResponseEntity<String> resetPassword(
        @RequestHeader(name="X-User-Id") UUID userId,
        @RequestBody @Valid PasswordResetDto dto
    ){
        userService.resetPassword(userId, dto);
        return ResponseEntity.ok("Password changed successfully.");
    }

    @PatchMapping("reset/email")
    public ResponseEntity<String> resetEmail(
        @RequestHeader(name="X-User-Id") UUID userId,
        @RequestBody @Valid EmailResetDto dto
    ){ 
        //here you should call user service and send to it the secret key and check the response ....
        userService.resetEmail(userId, dto);

        return ResponseEntity.ok("Email changed successfully.");
    }
}
