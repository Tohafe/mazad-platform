package com.mazad.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordResetDto(
    @NotBlank(message="Old Password Required")
    @Size(min = 8, max = 25, message="Invalid Old Password")
    String oldPassword,
    @NotBlank(message="New Password Required")
    @Size(min = 8, max = 25, message="Password Must Be At Least 8 Char")
    String newPassword
) {}
