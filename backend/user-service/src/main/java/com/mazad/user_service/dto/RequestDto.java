package com.mazad.user_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record RequestDto(
    @NotBlank(message="Required Field")
    @Size(min=3, max=15, message="First Name Must Be At Least 3 Char")
    String firstName,
    @Size(min=3, max=15, message="Last Name Must Be At Least 3 Char")
    @NotBlank(message="Required Field")
    String lastName,
    @NotBlank(message="Required Field")
    @Size(min=10, max=20, message="Should Be A Valid Phone Number")
    String phoneNumber,
    @NotBlank(message="Required Field")
    @Size(min=10, max=200, message="Address Should Be Between 10 And 200 Char")
    String address,
    @NotBlank(message="Required Field")
    @Size(min=4, max=20, message="City Should Be Between 4 And 20 Char")
    String city,
    @NotBlank(message="Required Field")
    @Size(min=2, max=20, message="Country Should Be Between 4 And 20 Char")
    String country,

    @Size(min=10, max=500, message="Bio Should Be Between 10 And 500 Char")
    String bio,

    String avatarImageId,
    String avatarUrl,
    String avatarThumbnailUrl
) {}
