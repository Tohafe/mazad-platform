package com.mazad.item.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Builder
public record ItemRequestDto(
        @NotNull(message = "Category id is required")
        Long categoryId,
        @NotBlank(message = "Title is required")
        @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
        String title,
        String description,
        @NotNull(message = "Thumbnail is required")
        String thumbnail,
        String document,
        List<String> images,
        Map<String, String> specs,
        String shippingInfo,
        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        Long startingPrice,
        @NotNull(message = "End time is required")
        @Future(message = "End time must be in the future")
        Instant endsAt
) {
}
