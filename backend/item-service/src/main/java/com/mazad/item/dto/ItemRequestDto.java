package com.mazad.item.dto;

import com.mazad.item.entity.AuctionStatus;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Builder
public record ItemRequestDto(
        @NotNull(message = "Category id is required")
        Long categoryId,
        @NotBlank(message = "Title is required")
        String title,
        String description,
        AuctionStatus status,
        List<String> images,
        Map<String, String> specs,
        String shippingInfo,
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
