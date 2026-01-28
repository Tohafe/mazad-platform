package com.mazad.auth.service;

import java.time.Instant;
import java.util.UUID;

import com.mazad.auth.client.UserServiceClient;
import com.mazad.auth.dto.*;
import com.mazad.auth.exception.*;
import feign.FeignException;
import jakarta.validation.constraints.NotNull;
import org.bouncycastle.jcajce.provider.asymmetric.ec.KeyFactorySpi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mazad.auth.entity.RefreshToken;
import com.mazad.auth.entity.UserEntity;
import com.mazad.auth.mapper.UserMapper;
import com.mazad.auth.repo.RefreshTokenRepo;
import com.mazad.auth.repo.UserRepo;

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
    private final UserServiceClient client;

    @Value("${auth-user.sync.key}")
    String syncKey;

    public UserResponseDTO addUser(UserRequestDTO userRequest) {
        UserEntity user = mapper.toEntity(userRequest);

        if (repo.existsByEmail(user.getEmail()))
            throw new DuplicateResourceException("Email is already in use");
        else if (repo.existsByUserName(user.getUserName()))
            throw new DuplicateResourceException("Username is already taken");

        user = repo.save(user);
        return mapper.toResponseDTO(user);
    }

    public AuthResponseDto verifyUser(UserRequestDTO loginRequest, String refreshToken) {

        Authentication auth;
        AuthResponseDto authResponse;
        TokensDto tokens;

        auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.email(), loginRequest.password()));

        if (refreshToken != null)
            tokenRepo.findByToken(refreshToken).ifPresent(tokenRepo::delete);
        if (!auth.isAuthenticated()) {
            throw new UnauthorizedException("Invalid Email Or Password");
        }
        tokens = jwtService.getTokens((UserEntity) auth.getPrincipal());
        authResponse = AuthResponseDto
                .builder()
                .accessToken(tokens.accessToken())
                .refreshToken(tokens.refreshToken())
                .user(mapper.toResponseDTO((UserEntity) auth.getPrincipal()))
                .build();
        return authResponse;
    }

    public void logout(String refreshToken) {
        tokenRepo.findByToken(refreshToken)
                .ifPresent(tokenRepo::delete);
    }

    public String refresh(String refreshToken) {
        RefreshToken token = tokenRepo
                .findByToken(refreshToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid Refresh Token"));
        if (token.getExpiryDate().isBefore(Instant.now())) {
            tokenRepo.delete(token);
            throw new UnauthorizedException("Expired Refresh Token");
        }
        return jwtService.generateAccessToken(token.getUser());
    }

    public void delete(UUID userId, String password) {
        UserEntity user = repo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        if (!encoder.matches(password, user.getPassword()))
            throw new BadRequestException("Invalid Password!");
        try {
            log.info("Sync auth service with User service to delete profile...");
            client.deleteProfile(syncKey, userId);
            repo.deleteById(userId);
            log.info("Sync Complete Successfully!, Profile deleted");
        } catch (FeignException.Unauthorized e) {
            log.error(e.getMessage());
            throw new UnauthorizedException("Unauthorized");
        } catch (FeignException e) {
            log.error(e.getMessage());
            throw new InternalServerErrorException("Unexpected Error, Please Try Later!");
        }
    }

    public void resetPassword(UUID userId, PasswordResetDto data) {
        UserEntity user = repo
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found."));

        if (!encoder.matches(data.oldPassword(), user.getPassword()))
            throw new UnauthorizedException("The old password you provided is incorrect.");
        user.setPassword(encoder.encode(data.newPassword()));
        repo.save(user);
    }

    public void resetEmail(UUID userId, @NotNull EmailResetDto dto) {
        UserEntity user = repo
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found."));

        if (repo.existsByEmail(dto.email()) || !encoder.matches(dto.password(), user.getPassword()))
            throw new BadRequestException("Invalid Email or Password");
        try {
            log.info("Sync auth service with User service to update email...");
            client.updateProfile(syncKey, CurrentUser.builder().id(userId).email(dto.email()).build());
            user.setEmail(dto.email());
            repo.save(user);
            log.info("Sync Complete Successfully!, email updated");
        } catch (FeignException.NotFound e) {
            log.info("Profile Not Found Updated Only On Auth Service");
            user.setEmail(dto.email());
            repo.save(user);
            log.info("Sync Complete Successfully!");
        } catch (FeignException.Unauthorized e) {
            log.error(e.getMessage());
            throw new UnauthorizedException("Unauthorized");
        } catch (FeignException e) {
            log.error(e.getMessage());
            throw new InternalServerErrorException("Unexpected Error, Please Try Later!");
        }
    }

}