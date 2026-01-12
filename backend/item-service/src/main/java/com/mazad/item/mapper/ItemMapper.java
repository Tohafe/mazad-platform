package com.mazad.item.mapper;

import com.mazad.item.dto.ItemRequest;
import com.mazad.item.dto.ItemDetailsDto;
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

    public ItemDetailsDto toResponse(ItemEntity entity) {
        if (entity == null)
            return null;
        return ItemDetailsDto.builder()
                .id(entity.getId())
                .categoryId(entity.getCategoryId())
                .sellerId(entity.getSellerId())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .status(entity.getStatus())
                .images(entity.getImages())
                .specs(entity.getSpecs())
                .shippingInfo(entity.getShippingInfo())
                .startingPrice(entity.getStartingPrice())
                .currentBid(entity.getCurrentBid())
                .startsAt(entity.getStartsAt())
                .endsAt(entity.getEndsAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
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
