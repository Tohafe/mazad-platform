package com.mazad.chat_service.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record MessageRequestDTO (
    @NotNull
    UUID    receiverId,
    @Size(max = 500, message = "message content is too long!")
    @NotBlank( message = "content connot be empty !")
    String    content
){}