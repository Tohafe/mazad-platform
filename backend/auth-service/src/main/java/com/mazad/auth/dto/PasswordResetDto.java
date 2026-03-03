package com.mazad.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordResetDto(
    @NotBlank(message="Password is required")
    @Size(min = 8, message = "must be at least 8 characters")
    @Size(max = 30, message = "must be less than 30 characters") 
    String password,

    @NotBlank(message="New password is required")
    @Size(min = 8, message = "must be at least 8 characters")
    @Size(max = 30, message = "must be less than 30 characters")
    @Pattern(regexp = ".*[A-Z].*", message = "must contain at least one uppercase letter")
    @Pattern(regexp = ".*[a-z].*", message = "must contain at least one lowercase letter")
    @Pattern(regexp = ".*[0-9].*", message = "must contain at least one number")
    @Pattern(regexp = ".*[\\W].*", message = "must contain at least one special character")
    String newPassword
) {}
