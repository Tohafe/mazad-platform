package com.mazad.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record UsernameResetDto(
    @NotBlank(message = "Username is required")
    @Size(min = 4, message = "must be at least 4 characters")
    @Size(max = 20, message = "must be less than 20 characters")
    @Pattern(regexp = "^[a-zA-Z]{3}.*", message = "must start with at least 3 letters")
    String username
) {}
