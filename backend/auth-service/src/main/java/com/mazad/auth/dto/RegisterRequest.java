package com.mazad.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @Email
    String email,
    
    @NotBlank
    @Size(min = 8, max = 25)
    String password,
    
    @NotBlank
    @Size(min = 4, max = 15)
    String userName,
    
    @NotBlank
    @Size(min = 3, max = 15)
    String firstName,
    
    @NotBlank
    @Size(min = 3, max = 15)
    String lastName
) {}
