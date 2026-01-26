package com.mazad.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailResetDto(
    @Email(message = "Invalid email")
    @NotBlank(message = "New Email Required")
    String email
) {}