package com.mazad.auth.controller;

import java.util.UUID;

import com.mazad.auth.entity.ApiKey;
import com.mazad.auth.service.ApiKeyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mazad.auth.dto.EmailResetDto;
import com.mazad.auth.dto.LoginResponseDto;
import com.mazad.auth.dto.PasswordResetDto;
import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UsernameResetDto;
import com.mazad.auth.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/v1/auth/")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    public final UserService userService;
    private final ApiKeyService apiKeyService;

    @Value("${auth.refresh-token-validity-days:4}")
    long    refreshValidity;

    @PostMapping("register")
    public ResponseEntity<LoginResponseDto> adddUser(
        @RequestBody @Validated(UserRequestDTO.OnRegister.class) UserRequestDTO userRequest
    ) {
        return userService.addUser(userRequest);
    }

    @PostMapping("login")
    public ResponseEntity<LoginResponseDto> userLogin(
        @RequestBody @Validated(UserRequestDTO.OnLogin.class) UserRequestDTO userRequest,
        @CookieValue(name="refresh_token", required=false) String refreshToken
    ) {
      return userService.verifyUser(userRequest, refreshToken);
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
    public LoginResponseDto  refresh(
        @CookieValue(name="refresh_token", required=false) String refreshToken
    ){
        return userService.refresh(refreshToken);
    }
    
//    @DeleteMapping("delete")
//    public ResponseEntity<String> delete(
//        @RequestHeader(name="X-User-Id") UUID userId,
//        @RequestBody JsonNode passNode
//    ){
//        String password;
//        if (!passNode.has("password"))
//            throw new BadRequestException("Password Required!");
//        password = passNode.get("password").asString();
//        if (password == null || password.isBlank())
//            throw new BadRequestException("Password Can't Be Empty!");
//        userService.delete(userId, passNode.get("password").asString());
//        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Deleted");
//    }

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
        userService.resetEmail(userId, dto);
        return ResponseEntity.ok("Email changed successfully.");
    }
    @PatchMapping("reset/username")
    public ResponseEntity<String> resetUsername(
        @RequestHeader(name="X-User-Id") UUID userId,
        @RequestBody @Valid UsernameResetDto dto
    ){
        userService.resetUsername(userId, dto);
        return ResponseEntity.ok("Username changed successfully.");
    }

    @PostMapping("keys")
    public ResponseEntity<String> generateApiKey(
            @RequestHeader(name="X-User-Id") UUID userId
    ) {
        ApiKey newKey = apiKeyService.generateAndSaveApiKey(userId);
        return ResponseEntity.ok(newKey.getApiKey());
    }

    @GetMapping("key")
    public ResponseEntity<String> getApiKey(@RequestHeader(name = "X-User-Id") UUID userId) {
        return ResponseEntity.ok(apiKeyService.getApiKey(userId));
    }
}
