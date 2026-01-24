package com.mazad.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.groups.Default;

public record UserRequestDTO(
    @Email(groups={OnLogin.class, OnRegister.class}, message="Not A Valid Email")
    @NotBlank(groups={OnLogin.class, OnRegister.class}, message="Not A Valid Email")
    String email,
    
    @NotBlank(groups={OnLogin.class, OnRegister.class}, message="Not A Valid Password")
    @Size(min = 8, max = 25, message="Password Must Be At Least 8 Char")
    String password,
    
    @NotBlank(message="Not A Valid User Name")
    @Size(min = 4, max = 15, message="User Name Must Be At Least 4 Char")
    String userName
    
) {
    public interface OnLogin{}
    public interface OnRegister extends Default{}
}
