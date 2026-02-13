package com.mazad.item.dto;

import java.util.List;

public record CategorizedItemsDto(
        CategoryDto category,
        List<ItemSummaryDto> items
) {
}
