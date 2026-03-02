package com.mazad.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordResetDto(
    @NotBlank(message="Old Password Required")
    @Size(min = 8, max = 30, message="New Password must be 8-30 characters long")
    String password,
    @NotBlank(message="New Password Required")
    @Size(min = 8, max = 30, message="Password must be 8-30 characters long")
    String newPassword
) {}
