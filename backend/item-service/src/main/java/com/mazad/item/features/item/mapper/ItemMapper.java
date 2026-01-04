package com.mazad.item.features.item.mapper;

import com.mazad.item.features.item.dto.ItemRequest;
import com.mazad.item.features.item.dto.ItemResponse;
import com.mazad.item.features.item.entity.ItemEntity;
import org.springframework.stereotype.Component;

@Component
public class ItemMapper {


    public ItemEntity toEntity(ItemRequest itemRequest) {
        if (itemRequest == null)
            return null;
        return ItemEntity.builder()
                .categoryId(itemRequest.categoryId())
                .title(itemRequest.title())
                .description(itemRequest.description())
                .startingPrice(itemRequest.startingPrice())
                .startsAt(itemRequest.startsAt())
                .endsAt(itemRequest.endsAt())
                .build();
    }

    public ItemResponse toResponse(ItemEntity entity) {
        if (entity == null)
            return null;
        return new ItemResponse(
                entity.getId(),
                entity.getCategoryId(),
                entity.getSellerId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getStatus(),
                entity.getStartingPrice(),
                entity.getCurrentBid(),
                entity.getStartsAt(),
                entity.getEndsAt()
        );
    }
}
