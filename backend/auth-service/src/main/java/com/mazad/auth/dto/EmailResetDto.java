package com.mazad.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmailResetDto(
    @Email(message = "Invalid email")
    @NotBlank(message = "New Email Required")
    String email,

    @NotBlank(message = "Password Required")
    @Size(min = 8, message="Invalid Password")
    String password
) {}