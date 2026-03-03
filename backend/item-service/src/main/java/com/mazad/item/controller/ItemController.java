package com.mazad.item.controller;

import com.mazad.item.dto.*;
import com.mazad.item.dto.event.ItemCreatedEventDto;
import com.mazad.item.entity.ItemEntity;
import com.mazad.item.repository.ItemRepository;
import com.mazad.item.service.ItemService;
import com.mazad.item.service.kafka.ItemProducer;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;
    private final ItemRepository itemRepository;
    private final ItemProducer itemProducer;

    @PostMapping
    public ResponseEntity<ItemDetailsDto> create(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody @Valid ItemRequestDto itemRequestDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(itemService.createItem(itemRequestDto, userId));
    }

    @PutMapping("{id}")
    public ResponseEntity<ItemDetailsDto> update(
            @PathVariable Long id,
            @RequestBody @Valid ItemRequestDto itemRequestDto,
            @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(itemService.updateItem(id, itemRequestDto, userId));
    }

    @PatchMapping(path = "{id}")
    public ResponseEntity<ItemDetailsDto> patch(@PathVariable Long id, @RequestBody JsonNode patch, @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(itemService.patchItem(id, patch, userId));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestHeader("X-User-Id") UUID userId) {
        itemService.deleteItem(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDetailsDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItem(id));
    }

    @GetMapping
    public PagedModel<ItemSummaryDto> listItems(
            @ModelAttribute ItemSearch itemSearch,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return itemService.listItemsBy(itemSearch, pageable);
    }

    @GetMapping("/ending-soon")
    public ResponseEntity<List<ItemSummaryDto>> endingSoon(
            @RequestParam(defaultValue = "24") int hours,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(itemService.endingSoonItems(hours, limit));
    }

    @PostMapping("{id}/cancel")
    public ResponseEntity<ItemDetailsDto> cancel(@PathVariable Long id, @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(itemService.cancelItem(id, userId));
    }

    @PostMapping("/backfill-kafka")
    public ResponseEntity<BackfillResponse> backfillKafka(
            @RequestParam(defaultValue = "500") int limit,
            @RequestParam(defaultValue = "false") boolean onlyActive
    ) {
        int safeLimit = Math.max(1, Math.min(limit, 5000));

        List<ItemEntity> items = itemRepository
                .findAll(PageRequest.of(0, safeLimit))
                .getContent();

        int sent = 0;
        for (ItemEntity item : items) {
//            if (onlyActive && item.getStatus() != AuctionStatus.ACTIVE) continue;

            ItemCreatedEventDto event = ItemCreatedEventDto.builder()
                    .id(item.getId())
                    .status(item.getStatus())
                    .startingPrice(item.getStartingPrice())
                    .endsAt(item.getEndsAt())
                    .build();

            // bidding-service listens to item.updated.topic in your setup
            itemProducer.sendItemCreatedEvent(event);
            sent++;
        }

        return ResponseEntity.ok(new BackfillResponse(sent, safeLimit, onlyActive));
    }

    public record BackfillResponse(int sent, int scanned, boolean onlyActive) {
    }

}
