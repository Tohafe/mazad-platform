package com.mazad.auth.service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mazad.auth.dto.CurrentUser;
import com.mazad.auth.dto.EmailResetDto;
import com.mazad.auth.dto.LoginResponseDto;
import com.mazad.auth.dto.PasswordResetDto;
import com.mazad.auth.dto.TokensDto;
import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.dto.UsernameResetDto;
import com.mazad.auth.entity.RefreshToken;
import com.mazad.auth.entity.UserEntity;
import com.mazad.auth.exception.DuplicateResourceException;
import com.mazad.auth.exception.ResourceNotFoundException;
import com.mazad.auth.exception.UnauthorizedException;
import com.mazad.auth.mapper.UserMapper;
import com.mazad.auth.repo.RefreshTokenRepo;
import com.mazad.auth.repo.UserRepo;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepo repo;
    private final UserMapper mapper;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final RefreshTokenRepo tokenRepo;
    private final PasswordEncoder encoder;
    private final KafkaProducerService kafka;

    @Value("${auth-user.sync.topic}")
    String syncTopic;
    @Value("${auth.refresh-token-validity-days:4}")
    long    refreshValidity;
    @Value("${DEFAULT_SOLD}")
    String DEFAULT_SOLD;

    public ResponseEntity<LoginResponseDto> addUser(UserRequestDTO userRequest) {
        UserEntity user = mapper.toEntity(userRequest);
        TokensDto tokens;

        if (repo.existsByEmail(user.getEmail()))
            throw new DuplicateResourceException("Email is already in use", "email");
        else if (repo.existsByUsername(user.getUserName()))
            throw new DuplicateResourceException("Username is already taken", "username");

        user = repo.save(user);
        kafka.produce(syncTopic, CurrentUser.builder().id(user.getId()).email(user.getEmail()).username(user.getUserName()).sold(DEFAULT_SOLD).build());
        tokens = jwtService.getTokens(user);
        return getLoginResponse(tokens.refreshToken(),
                tokens.accessToken(),
                mapper.toResponseDTO(user));
    }

    public ResponseEntity<LoginResponseDto>  verifyUser(UserRequestDTO loginRequest, String refreshToken) {
        Authentication auth;
        TokensDto tokens;

        auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.email(), loginRequest.password()));

        if (refreshToken != null)
            tokenRepo.findByToken(refreshToken).ifPresent(tokenRepo::delete);
        if (!auth.isAuthenticated()) {
            throw new UnauthorizedException("Invalid Email Or Password");
        }
        tokens = jwtService.getTokens((UserEntity) auth.getPrincipal());
        return getLoginResponse(tokens.refreshToken(),
                tokens.accessToken(),
                mapper.toResponseDTO((UserEntity) auth.getPrincipal()));
    }

    private ResponseEntity<LoginResponseDto> getLoginResponse(String refreshToken, String accessToken, UserResponseDTO user) {
        ResponseCookie refreshCookie;
        LoginResponseDto loginResponse;


        refreshCookie = ResponseCookie
                .from("refresh_token", refreshToken)
                .httpOnly(true)
                .sameSite("None") // "None" allows the cookie to be sent across different ports @Naoufal .sameSite("Strict")
                .secure(true) // true for HTTPS on production
                .path("/api/v1/auth/")
                .maxAge(Duration.ofDays(refreshValidity))
                .build();
        loginResponse = LoginResponseDto
                .builder()
                .accessToken(accessToken)
                .user(user)
                .build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(loginResponse);
    }

    public void logout(String refreshToken) {
        tokenRepo.findByToken(refreshToken)
                .ifPresent(tokenRepo::delete);
    }

    public LoginResponseDto refresh(String refreshToken) {
        RefreshToken token = tokenRepo
                .findByToken(refreshToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid Refresh Token"));
        if (token.getExpiryDate().isBefore(Instant.now())) {
            tokenRepo.delete(token);
            throw new UnauthorizedException("Expired Refresh Token");
        }
        String accessToken = jwtService.generateAccessToken(token.getUser());

        return LoginResponseDto.builder()
                .accessToken(accessToken)
                .user(mapper.toResponseDTO(token.getUser()))
                .build();
    }


    public void resetPassword(UUID userId, PasswordResetDto data) {
        UserEntity user = repo
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found."));

        if (!encoder.matches(data.password(), user.getPassword()))
            throw new UnauthorizedException("The old password you provided is incorrect.");
        user.setPassword(encoder.encode(data.newPassword()));
        repo.save(user);
    }

    public void resetEmail(UUID userId, @NotNull EmailResetDto dto) {
        UserEntity user = repo
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found."));

        if (repo.existsByEmail(dto.email()) || !encoder.matches(dto.password(), user.getPassword()))
            throw new UnauthorizedException("Invalid Password or email");
        user.setEmail(dto.email());
        repo.save(user);
        kafka.produce(syncTopic, CurrentUser.builder().id(userId).email(dto.email()).build());
    }

    public void resetUsername(UUID userId, @NotNull UsernameResetDto dto){
        UserEntity user = repo
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found."));

        if (repo.existsByUsername(dto.username()))
            throw new DuplicateResourceException("Username is already taken", "username");
        user.setUsername(dto.username());
        repo.save(user);
        kafka.produce(syncTopic, CurrentUser.builder().id(userId).username(dto.username()).build());
    }

}