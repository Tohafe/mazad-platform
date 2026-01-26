package com.mazad.user_service.dto;

import java.util.UUID;

import lombok.Builder;

@Builder
public record  CurrentUser (
    UUID id,
    String email,
    String userName
) {}
