package com.mazad.auth.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.service.UserService;

import lombok.RequiredArgsConstructor;







@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    public final UserService service;

    @PostMapping("auth/register")
    public UserResponseDTO adddUser(
        @RequestBody @Validated(UserRequestDTO.OnRegister.class) UserRequestDTO userRequest
    ) {
        return service.addUser(userRequest);
    }

    @GetMapping("/users")
    public List<UserResponseDTO> allUsers() {
        return service.getAllUsers();
    }
 
    @GetMapping("users/{userId}")
    public UserResponseDTO getUserById(@PathVariable UUID userId) {
        return service.getUserById(userId);
    }
    

    
}
