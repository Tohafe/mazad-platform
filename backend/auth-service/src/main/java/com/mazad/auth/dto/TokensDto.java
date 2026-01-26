package com.mazad.auth.dto;

import lombok.Builder;

@Builder
public record  TokensDto(
    String accessToken,
    String refreshToken
) {}
