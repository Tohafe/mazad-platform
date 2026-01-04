package com.mazad.item.mapper;

import com.mazad.item.dto.CategoryResponse;
import com.mazad.item.entity.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(CategoryEntity entity) {
        if (entity == null) return null;
        return CategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .build();
    }
}
