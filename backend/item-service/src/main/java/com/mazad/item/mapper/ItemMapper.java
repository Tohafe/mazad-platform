package com.mazad.item.mapper;

import com.mazad.item.dto.*;
import com.mazad.item.dto.event.ItemEventDto;
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
                .thumbnail(itemRequestDto.thumbnail())
                .document(itemRequestDto.document())
                .shippingInfo(itemRequestDto.shippingInfo())
                .startingPrice(itemRequestDto.startingPrice())
                .endsAt(itemRequestDto.endsAt());

        if (itemRequestDto.images() != null)
            builder.images(itemRequestDto.images());
        if (itemRequestDto.specs() != null)
            builder.specs(itemRequestDto.specs());
        return builder.build();
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
                .thumbnail(entity.getThumbnail())
                .document(entity.getDocument())
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
                .thumbnail(entity.getThumbnail())
                .document(entity.getDocument())
                .startingPrice(entity.getStartingPrice())
                .endsAt(entity.getEndsAt())
                .build();
    }

    public ItemSummaryDto toItemSummaryDto(ItemEntity entity) {
        if (entity == null) return null;
        return ItemSummaryDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .thumbnail(entity.getThumbnail())
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
                .sellerId(entity.getSellerId())
                .status(entity.getStatus())
                .startingPrice(entity.getStartingPrice())
                .endsAt(entity.getEndsAt())
                .build();
    }

}
