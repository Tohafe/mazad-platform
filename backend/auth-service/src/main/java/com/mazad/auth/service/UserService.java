package com.mazad.auth.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mazad.auth.dto.AuthResponseDto;
import com.mazad.auth.dto.EmailResetDto;
import com.mazad.auth.dto.PasswordResetDto;
import com.mazad.auth.dto.TokensDto;
import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.entity.RefreshToken;
import com.mazad.auth.entity.UserEntity;
import com.mazad.auth.exception.DuplicateResourceException;
import com.mazad.auth.exception.ResourceNotFoundException;
import com.mazad.auth.exception.UnauthorizedException;
import com.mazad.auth.mapper.UserMapper;
import com.mazad.auth.repo.RefreshTokenRepo;
import com.mazad.auth.repo.UserRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {
    private  final  UserRepo repo;
    private  final  UserMapper mapper;
    private  final  AuthenticationManager authManager;
    private  final  JwtService jwtService;
    private  final  RefreshTokenRepo tokenRepo;
    private  final  PasswordEncoder encoder;

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
        
        Authentication  auth;
        AuthResponseDto authResponse;
        TokensDto       tokens;
        
        auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(
                                loginRequest.email(), loginRequest.password()));
        
        if (refreshToken != null)
            tokenRepo.findByToken(refreshToken).ifPresent(tokenRepo::delete);
        if (!auth.isAuthenticated()){
            throw new UnauthorizedException("Invalid Email Or Password");
        }
        tokens = jwtService.getTokens((UserEntity)auth.getPrincipal());
        authResponse = AuthResponseDto
                        .builder()
                        .accessToken(tokens.accessToken())
                        .refreshToken(tokens.refreshToken())
                        .user(mapper.toResponseDTO((UserEntity)auth.getPrincipal()))
                        .build();
        return authResponse;
    }

    public void logout(String refreshToken){
        tokenRepo.findByToken(refreshToken)
                .ifPresent(tokenRepo::delete);
    }

    public String refresh(String refreshToken) {
        RefreshToken token = tokenRepo
                                .findByToken(refreshToken)
                                .orElseThrow(() -> new UnauthorizedException("Invalid Refresh Token"));
        if (token.getExpiryDate().isBefore(Instant.now())){
            tokenRepo.delete(token);
            throw new UnauthorizedException("Expired Refresh Token");
        }
        return jwtService.generateAccessToken(token.getUser());
    }

    public void delete(UUID userId) {
        if (!repo.existsById(userId))
            throw new ResourceNotFoundException("User Not Found");
        repo.deleteById(userId);
    }
// can the user change his email or not ? the same for username
    public void resetPassword(UUID userId, PasswordResetDto data) {
        UserEntity user = repo
                    .findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User Not Found."));
                    
        if (!encoder.matches(data.oldPassword(), user.getPassword()))
            throw new UnauthorizedException("The old password you provided is incorrect.");
        user.setPassword(encoder.encode(data.newPassword()));
        repo.save(user);
    }
                
    public void resetEmail(UUID userId, EmailResetDto dto){
        UserEntity user = repo
                    .findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User Not Found."));
        //shoul get updated on the profile first
        user.setEmail(dto.email());
        repo.save(user);
    }

}