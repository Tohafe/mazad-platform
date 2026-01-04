package com.mazad.item.features.item.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;

public record ItemRequest(
        @NotNull(message = "Category id is required")
        Long categoryId,
        @NotBlank(message = "Title is required")
        String title,
        String description,
        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        BigDecimal startingPrice,
        @NotNull(message = "Start time is required")
        @Future(message = "Start time must be in the future")
        Instant startsAt,
        @NotNull(message = "End time is required")
        @Future(message = "End time must be in the future")
        Instant endsAt
) {
}
