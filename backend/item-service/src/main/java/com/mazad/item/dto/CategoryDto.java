package com.mazad.item.dto;

import lombok.Builder;

@Builder
public record CategoryDto(
        Long id,
        String name,
        String description,
        String imageUrl,
        String hexColor,
        String icon
) {
}
