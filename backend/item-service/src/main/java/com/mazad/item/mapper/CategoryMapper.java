package com.mazad.item.mapper;

import com.mazad.item.dto.CategoryDto;
import com.mazad.item.entity.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryDto toResponse(CategoryEntity entity) {
        if (entity == null) return null;
        return CategoryDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .imageUrl(entity.getImageUrl())
                .hexColor(entity.getHexColor())
                .icon(entity.getIcon())
                .build();
    }
}
