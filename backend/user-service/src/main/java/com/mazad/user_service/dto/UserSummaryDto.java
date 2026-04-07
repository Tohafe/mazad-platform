package com.mazad.user_service.dto;

import lombok.Builder;

@Builder
public record UserSummaryDto(
    String username,
    String firstName,
    String lastName,
    String avatarUrl
) {}
