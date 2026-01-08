package com.mazad.item.service.impl;

import com.mazad.item.exceptions.ResourceNotFoundException;
import com.mazad.item.dto.ItemRequest;
import com.mazad.item.dto.ItemResponse;
import com.mazad.item.dto.ItemSearch;
import com.mazad.item.entity.AuctionStatus;
import com.mazad.item.entity.ItemEntity;
import com.mazad.item.mapper.ItemMapper;
import com.mazad.item.repository.ItemRepository;
import com.mazad.item.service.ItemService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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


    @Override
    public ItemResponse createItem(ItemRequest itemRequest, UUID sellerId) {
        ItemEntity entity = mapper.toEntity(itemRequest);
        entity.setSellerId(sellerId);
        entity.setStatus(AuctionStatus.ACTIVE);
        entity.setCurrentBid(BigDecimal.ZERO);
        return mapper.toResponse(itemRepo.save(entity));
    }

    @Override
    public ItemResponse getItem(Long id) {
        ItemEntity entity = itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + id + ") can't be found"));
        return mapper.toResponse(entity);
    }

    public PagedModel<ItemResponse> getItemsPage(int page, int size) {
        if (page < 0 || size <= 0)
            throw new ValidationException("The page info is invalid");
        Pageable pageable = PageRequest.of(page, size, Sort.by("endsAt").ascending());
        Page<ItemResponse> items = itemRepo.findAllByStatus(AuctionStatus.ACTIVE, pageable)
                .map(mapper::toResponse);
        return new PagedModel<>(items);
    }

    @Override
    @SuppressWarnings("Convert2MethodRef")
    public PagedModel<ItemResponse> listItemsBy(ItemSearch itemSearch, Pageable pageable) {
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnoreCase()
                .withMatcher("sellerId", match -> match.exact())
                .withMatcher("status", match -> match.exact())
                .withMatcher("startingPrice", match -> match.exact())
                .withMatcher("currentBid", match -> match.exact())
                .withMatcher("startsAt", match -> match.exact())
                .withMatcher("endsAt", match -> match.exact())
                .withMatcher("title", match -> match.contains().ignoreCase());
        Example<ItemEntity> example = Example.of(mapper.toEntity(itemSearch), matcher);
        Page<ItemResponse> itemPage = itemRepo.findAll(example, pageable).map(mapper::toResponse);
        return new PagedModel<>(itemPage);
    }

    @Override
    public ItemResponse updateItem(Long id, ItemRequest itemRequest) {
        ItemEntity entity = itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + id + ") can't be found"));
        entity.setCategoryId(itemRequest.categoryId());
        entity.setTitle(itemRequest.title());
        entity.setDescription(itemRequest.description());
        entity.setStartingPrice(itemRequest.startingPrice());
        entity.setStartsAt(itemRequest.startsAt());
        entity.setEndsAt(itemRequest.endsAt());
        ItemEntity updatedEntity = itemRepo.save(entity);
        return mapper.toResponse(updatedEntity);
    }

    @Override
    public ItemResponse patchItem(Long id, JsonNode patchNode) {
        ItemEntity entity = itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + id + ") can't be found"));
        jsonMapper.readerForUpdating(entity).readValue(patchNode);
        ItemEntity savedEntity = itemRepo.save(entity);
        return mapper.toResponse(savedEntity);
    }

    @Override
    public void deleteItem(Long id) {
        itemRepo.deleteById(id);
    }
}
