package com.mazad.user_service.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PatchDto {
    @Size(min=3, max=15, message="First Name Must Be At Least 3 Char")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Invalid first name")
    String firstName;

    @Size(min=3, max=15, message="Last Name Must Be At Least 3 Char")
    @Pattern(regexp = "^[A-Za-z\\s]+$", message = "Invalid last name")
    String lastName;

    @Size(min=10, max=10, message="Invalid phone number")
    @Pattern(regexp = "^0[0-9]+$", message = "Invalid phone number: must start with 0 and contain only digits")
    String phoneNumber;

    @Size(min=10, max=200, message="Address Should Be Between 10 And 200 Char")
    String address;

    @Size(min=2, max=20, message="City Should Be Between 4 And 20 Char")
    String city;

    @Size(min=2, max=20, message="Country Should Be Between 4 And 20 Char")
    @Pattern(
        regexp = "^(Morocco)$", 
        message = "Please select a supported country"
    )
    String country;

    @Size(max=500, message="must be less than 500 characters")
    String bio;

    String avatarImageId;
    String avatarUrl;
    String avatarThumbnailUrl;
}
