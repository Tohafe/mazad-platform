package com.mazad.item.dto;

import com.mazad.item.entity.AuctionStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;

public record ItemRequest(
        @NotNull(message = "Category id is required")
        Long categoryId,
        @NotNull(message = "Title can't be null")
        @NotBlank(message = "Title is required")
        String title,
        String description,
        AuctionStatus status,
        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        BigDecimal startingPrice,
        @NotNull(message = "Start time is required")
        @FutureOrPresent(message = "Start time must be in the future")
        Instant startsAt,
        @NotNull(message = "End time is required")
        @Future(message = "End time must be in the future")
        Instant endsAt
) {
}
