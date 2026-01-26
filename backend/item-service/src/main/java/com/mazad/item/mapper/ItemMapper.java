package com.mazad.item.mapper;

import com.mazad.item.dto.*;
import com.mazad.item.entity.AuctionStatus;
import com.mazad.item.entity.ItemEntity;
import org.springframework.stereotype.Component;

@Component
public class ItemMapper {


    public ItemEntity toEntity(ItemRequestDto itemRequestDto) {
        if (itemRequestDto == null)
            return null;
        ItemEntity.ItemEntityBuilder builder = ItemEntity.builder()
                .categoryId(itemRequestDto.categoryId())
                .title(itemRequestDto.title())
                .description(itemRequestDto.description())
                .status(itemRequestDto.status())
                .shippingInfo(itemRequestDto.shippingInfo())
                .startingPrice(itemRequestDto.startingPrice())
                .startsAt(itemRequestDto.startsAt())
                .endsAt(itemRequestDto.endsAt());

        if (itemRequestDto.images() != null)
            builder.images(itemRequestDto.images());
        if (itemRequestDto.specs() != null)
            builder.specs(itemRequestDto.specs());
        return builder.build();
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

    public ItemDetailsDto toItemDetailsDto(ItemEntity entity) {
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

    public ItemRequestDto toItemRequestDto(ItemEntity entity) {
        if (entity == null)
            return null;
        return ItemRequestDto.builder()
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

    public ItemEventDto toItemEventDto(ItemEntity entity) {
        if (entity == null) return null;
        return ItemEventDto.builder()
                .id(entity.getId())
                .status(entity.getStatus() == AuctionStatus.ACTIVE)
                .startingPrice(entity.getStartingPrice())
                .build();
    }
}
