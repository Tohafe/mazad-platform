package com.mazad.item.mapper;

import com.mazad.item.dto.ItemRequest;
import com.mazad.item.dto.ItemResponse;
import com.mazad.item.dto.ItemSearch;
import com.mazad.item.dto.ItemSummaryDto;
import com.mazad.item.entity.ItemEntity;
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

    public ItemEntity toEntity(ItemSearch itemSearch) {
        if (itemSearch == null)
            return null;
        return ItemEntity.builder()
                .sellerId(itemSearch.sellerId())
                .categoryId(itemSearch.categoryId())
                .title(itemSearch.title())
                .description(itemSearch.description())
                .status(itemSearch.status())
                .startingPrice(itemSearch.startingPrice())
                .currentBid(itemSearch.currentBid())
                .startsAt(itemSearch.startsAt())
                .endsAt(itemSearch.endsAt())
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

    public ItemRequest toRequest(ItemEntity entity) {
        if (entity == null)
            return null;
        return ItemRequest.builder()
                .categoryId(entity.getCategoryId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .startingPrice(entity.getStartingPrice())
                .startsAt(entity.getStartsAt())
                .endsAt(entity.getEndsAt())
                .build();
    }

    public ItemSummaryDto toItemSummaryDto(ItemEntity entity) {
        if (entity == null) return null;
        return ItemSummaryDto.builder()
                .title(entity.getTitle())
                .thumbnail(entity.getImages().isEmpty() ? null : entity.getImages().get(0))
                .currentBid(entity.getCurrentBid())
                .status(entity.getStatus())
                .startsAt(entity.getStartsAt())
                .endsAt(entity.getEndsAt())
                .build();
    }
}
