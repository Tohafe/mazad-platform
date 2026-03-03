package com.mazad.item.service.impl;

import com.mazad.item.dto.*;
import com.mazad.item.dto.event.ItemUpdatedEventDto;
import com.mazad.item.exceptions.ItemNotEditableException;
import com.mazad.item.exceptions.ResourceNotFoundException;
import com.mazad.item.entity.AuctionStatus;
import com.mazad.item.entity.ItemEntity;
import com.mazad.item.mapper.ItemMapper;
import com.mazad.item.repository.ItemRepository;
import com.mazad.item.service.kafka.ItemProducer;
import com.mazad.item.service.ItemService;
import com.mazad.item.specification.ItemSpec;
import com.mazad.item.validators.ItemBusinessValidator;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final ItemMapper mapper;
    private final ItemRepository itemRepo;
    private final JsonMapper jsonMapper;
    private final ItemProducer producer;
    private final ItemBusinessValidator validator;


    @Override
    public ItemDetailsDto createItem(ItemRequestDto itemRequestDto, UUID sellerId) {
        ItemEntity entity = mapper.toEntity(itemRequestDto);
        entity.setSellerId(sellerId);
        entity.setCurrentBid(0L);
        entity.setStatus(AuctionStatus.ACTIVE);
        entity.setStartsAt(Instant.now().truncatedTo(ChronoUnit.MINUTES));
        entity.setEndsAt(entity.getEndsAt().truncatedTo(ChronoUnit.MINUTES));

        validator.validateCreate(entity);

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
    public PagedModel<ItemSummaryDto> listItemsBy(ItemSearch itemSearch, Pageable pageable) {
        Specification<ItemEntity> spec = ItemSpec.withSearch(itemSearch);
        Page<ItemSummaryDto> itemPage = itemRepo.findAll(spec, pageable).map(mapper::toItemSummaryDto);
        return new PagedModel<>(itemPage);

    }

    @Override
    public ItemDetailsDto updateItem(Long id, ItemRequestDto itemRequestDto, UUID userId) {
        ItemEntity entity = itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + id + ") can't be found"));
        validator.validateUpdate(id, entity, userId);
        entity.setCategoryId(itemRequestDto.categoryId());
        entity.setTitle(itemRequestDto.title());
        entity.setDescription(itemRequestDto.description());
        entity.setStartingPrice(itemRequestDto.startingPrice());
        entity.setEndsAt(itemRequestDto.endsAt());
        entity.setShippingInfo(itemRequestDto.shippingInfo());
        entity.setImages(itemRequestDto.images());
        entity.setSpecs(itemRequestDto.specs());
        ItemEntity updatedEntity = itemRepo.save(entity);
        return mapper.toItemDetailsDto(updatedEntity);
    }

    @Override
    public ItemDetailsDto patchItem(Long id, JsonNode patchNode, UUID userId) {
        ItemEntity entity = itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + id + ") can't be found"));
        validator.validatePatch(entity, patchNode, userId);
        jsonMapper.readerForUpdating(entity).readValue(patchNode);
        ItemEntity savedEntity = itemRepo.save(entity);
        return mapper.toItemDetailsDto(savedEntity);
    }

    @Override
    public void deleteItem(Long id, UUID userId) {
        itemRepo.findById(id).ifPresent(entity -> {
            validator.validateDelete(entity, userId);
            itemRepo.deleteById(id);
        });
    }


    @Override
    public List<ItemSummaryDto> endingSoonItems(int hours, int limit) {
        Instant endDate = Instant.now().plus(hours, ChronoUnit.HOURS);
        return itemRepo.findAllBetween(Instant.now(), endDate, Limit.of(limit))
                .stream()
                .map(mapper::toItemSummaryDto)
                .toList();
    }

    @Override
    public void applyUpdateEvent(ItemUpdatedEventDto itemEvent) {
        ItemEntity entity = itemRepo.findById(itemEvent.auctionId())
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + itemEvent.auctionId() + ") can't be found"));
        entity.setCurrentBid(itemEvent.currentHighestBid());
        entity.setEndsAt(itemEvent.endsAt());
        if (itemEvent.status() == AuctionStatus.CLOSED) {
            entity.setStatus(itemEvent.lastBidderId() != null ? AuctionStatus.SOLD: AuctionStatus.EXPIRED);
        } else entity.setStatus(itemEvent.status());
        itemRepo.save(entity);
    }

    @Override
    public ItemDetailsDto cancelItem(Long id, UUID userId) {
        ItemEntity entity = itemRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item (" + id + ") can't be found"));
        validator.validateCancel(entity, userId);
        entity.setStatus(AuctionStatus.CANCELLED);
        itemRepo.save(entity);
        return mapper.toItemDetailsDto(entity);
    }
}
