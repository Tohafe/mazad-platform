package com.mazad.user_service.dto.event;

import java.util.UUID;

import lombok.Builder;

@Builder
public record ItemEvent(
        Long id,
        UUID sellerId
) {}
