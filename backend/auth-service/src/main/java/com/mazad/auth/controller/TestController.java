package com.mazad.auth.controller;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.auth.dto.UserRequestDTO;
import com.mazad.auth.dto.UserResponseDTO;
import com.mazad.auth.service.UserService;

import lombok.AllArgsConstructor;



@RestController
@RequestMapping("/")
@AllArgsConstructor
public class TestController {
    public UserService service;

    @GetMapping
    public List<UserResponseDTO> test() {
        return service.getAll();
    }
    @PostMapping("/add")
    public UserResponseDTO adddUser(
        @RequestBody @Validated(UserRequestDTO.OnRegister.class) UserRequestDTO userRequest
    ) {
        return service.addUser(userRequest);
    }
    
}
