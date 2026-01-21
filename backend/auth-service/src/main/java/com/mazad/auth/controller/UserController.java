package com.mazad.auth.controller;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.auth.dto.AuthResponseDto;
import com.mazad.auth.dto.LoginResponseDto;
import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.service.UserService;

import lombok.RequiredArgsConstructor;







@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    public final UserService userService;
    @Value("${auth.refresh-token-validity-days:4}")
    long    refreshValidity;

    @PostMapping("auth/register")
    public UserResponseDTO adddUser(
        @RequestBody @Validated(UserRequestDTO.OnRegister.class) UserRequestDTO userRequest
    ) {
        return userService.addUser(userRequest);
    }

    @PostMapping("auth/login")
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
                            .path("/api/auth")
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
    
    @PostMapping("/auth/logout")
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

    @PostMapping("auth/refresh")
    public String  refresh(
        @CookieValue(name="refresh_token", required=false) String refreshToken
    ){
        return userService.refresh(refreshToken);
    }
    

    @GetMapping("users")
    public List<UserResponseDTO> allUsers() {
        return userService.getAllUsers();
    }
 
    @GetMapping("users/{userId}")
    public UserResponseDTO getUserById(@PathVariable UUID userId) {
        return userService.getUserById(userId);
    }
    
    
}
