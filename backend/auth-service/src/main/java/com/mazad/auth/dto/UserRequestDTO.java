package com.mazad.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.groups.Default;

public record UserRequestDTO(
    @Email(groups={OnLogin.class, OnRegister.class}, message="Invalid Email")
    @NotBlank(groups={OnLogin.class, OnRegister.class}, message="Email Required")
    String email,
    
    @NotBlank(groups={OnLogin.class, OnRegister.class}, message="Password is required")
    @Size(min = 8, message = "must be at least 8 characters")
    @Size(max = 30, message = "must be less than 30 characters")
    @Pattern(regexp = ".*[A-Z].*", message = "must contain at least one uppercase letter")
    @Pattern(regexp = ".*[a-z].*", message = "must contain at least one lowercase letter")
    @Pattern(regexp = ".*[0-9].*", message = "must contain at least one number")
    @Pattern(regexp = ".*[\\W].*", message = "must contain at least one special character")
    String password,
    
    @NotBlank(message = "Username is required")
    @Size(min = 4, message = "must be at least 4 characters")
    @Size(max = 20, message = "must be less than 20 characters")
    @Pattern(regexp = "^[a-zA-Z]{3}.*", message = "must start with at least 3 letters")
    String username
    
) {
    public interface OnLogin{}
    public interface OnRegister extends Default{}
}

