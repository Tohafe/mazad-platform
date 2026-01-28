package com.mazad.auth.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record CurrentUser(
    UUID id,
    String email,
    String userName
) {}
