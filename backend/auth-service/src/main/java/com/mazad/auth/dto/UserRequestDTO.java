package com.mazad.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.groups.Default;

public record UserRequestDTO(
    @Email(groups={OnLogin.class, OnRegister.class}, message="Invalid Email")
    @NotBlank(groups={OnLogin.class, OnRegister.class}, message="Email Required")
    String email,
    
    @NotBlank(groups={OnLogin.class, OnRegister.class}, message="Not A Valid Password")
    @Size(min = 8, max = 30,message="Password must be 8-30 characters long")
    String password,
    
    @NotBlank(message="Invalid User Name")
    @Size(min = 4, max = 20, message="Username must be 4-20 characters long")
    String username
    
) {
    public interface OnLogin{}
    public interface OnRegister extends Default{}
}
