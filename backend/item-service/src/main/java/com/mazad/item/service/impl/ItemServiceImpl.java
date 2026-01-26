package com.mazad.item.service.impl;

import com.mazad.item.dto.*;
import com.mazad.item.exceptions.ItemNotEditableException;
import com.mazad.item.exceptions.ResourceNotFoundException;
import com.mazad.item.entity.AuctionStatus;
import com.mazad.item.entity.ItemEntity;
import com.mazad.item.mapper.ItemMapper;
import com.mazad.item.repository.ItemRepository;
import com.mazad.item.service.kafka.ItemProducer;
import com.mazad.item.service.ItemService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final ItemMapper mapper;
    private final ItemRepository itemRepo;
    private final JsonMapper jsonMapper;
    private final ItemProducer producer;


    @Override
    public ItemDetailsDto createItem(ItemRequestDto itemRequestDto, UUID sellerId) {
        ItemEntity entity = mapper.toEntity(itemRequestDto);
        entity.setSellerId(sellerId);
        entity.setCurrentBid(BigDecimal.ZERO);
        AuctionStatus status = itemRequestDto.status() == null ? AuctionStatus.ACTIVE : itemRequestDto.status();
        if (status != AuctionStatus.ACTIVE && status != AuctionStatus.DRAFT)
            throw new ValidationException("Can't create an item with status of " + status);
        entity.setStatus(status);
        ItemEntity createdItem = itemRepo.save(entity);
        // Sending an item creation event to kafka broker
        producer.sendItemCreatedEvent(mapper.toItemEventDto(entity));
        return mapper.toItemDetailsDto(createdItem);
    }

    @Override
    public ItemDetailsDto getItem(Long id) {
        ItemEntity entity = itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + id + ") can't be found"));
        return mapper.toItemDetailsDto(entity);
    }


    @Override
    @SuppressWarnings("Convert2MethodRef")
    public PagedModel<ItemSummaryDto> listItemsBy(ItemSearch itemSearch, Pageable pageable) {
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnoreCase()
                .withIgnorePaths("specs", "images")
                .withMatcher("sellerId", match -> match.exact())
                .withMatcher("status", match -> match.exact())
                .withMatcher("startingPrice", match -> match.exact())
                .withMatcher("currentBid", match -> match.exact())
                .withMatcher("startsAt", match -> match.exact())
                .withMatcher("endsAt", match -> match.exact())
                .withMatcher("title", match -> match.contains().ignoreCase());
        Example<ItemEntity> example = Example.of(mapper.toEntity(itemSearch), matcher);
        Page<ItemSummaryDto> itemPage = itemRepo.findAll(example, pageable).map(mapper::toItemSummaryDto);
        return new PagedModel<>(itemPage);
    }

    @Override
    public ItemDetailsDto updateItem(Long id, ItemRequestDto itemRequestDto) {
        ItemEntity entity = itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + id + ") can't be found"));
        // An exception will be thrown if the status is not draft and the current bid is greater than 0.
        if (!isEditable(entity))
            throw new ItemNotEditableException("Item (" + id + ") can't be updated: status = " + entity.getStatus());
        entity.setCategoryId(itemRequestDto.categoryId());
        entity.setTitle(itemRequestDto.title());
        entity.setDescription(itemRequestDto.description());
        entity.setStartingPrice(itemRequestDto.startingPrice());
        entity.setStartsAt(itemRequestDto.startsAt());
        entity.setEndsAt(itemRequestDto.endsAt());
        ItemEntity updatedEntity = itemRepo.save(entity);
        return mapper.toItemDetailsDto(updatedEntity);
    }

    @Override
    public ItemDetailsDto patchItem(Long id, JsonNode patchNode) {
        ItemEntity entity = itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + id + ") can't be found"));
        // An exception will be thrown if the status is not draft and the current bid is greater than 0.
        if (!isEditable(entity))
            throw new ItemNotEditableException("Item (" + id + ") can't be edited: status = " + entity.getStatus());
        jsonMapper.readerForUpdating(entity).readValue(patchNode);
        ItemEntity savedEntity = itemRepo.save(entity);
        return mapper.toItemDetailsDto(savedEntity);
    }

    @Override
    public void deleteItem(Long id) {
        itemRepo.findById(id).ifPresent(entity -> {
            // An exception will be thrown if the status is not draft and the current bid is greater than 0.
            if (!isEditable(entity))
                throw new ItemNotEditableException("Item (" + id + ") can't be deleted: status = " + entity.getStatus());
            itemRepo.deleteById(id);
        });
    }

    private boolean isEditable(ItemEntity entity) {
        return !(entity.getStatus() != AuctionStatus.DRAFT && entity.getCurrentBid().compareTo(BigDecimal.ZERO) != 0);
    }
}
