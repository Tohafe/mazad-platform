package com.mazad.item.controller;

import com.mazad.item.dto.*;
import com.mazad.item.dto.event.ItemEventDto;
import com.mazad.item.entity.ItemEntity;
import com.mazad.item.exceptions.AuthorizationException;
import com.mazad.item.repository.ItemRepository;
import com.mazad.item.service.ItemService;
import com.mazad.item.service.kafka.ItemProducer;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
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

    private final static String USER_ID_HEADER = "X-User-Id";

    private final ItemService itemService;
    private final ItemRepository itemRepository;
    private final ItemProducer itemProducer;

    @PostMapping
    public ResponseEntity<ItemDetailsDto> create(
            @RequestHeader(value = USER_ID_HEADER, required = false) UUID userId,
            @RequestBody @Valid ItemRequestDto itemRequestDto) {
        if (userId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(itemService.createItem(itemRequestDto, userId));
    }

    @PutMapping("{id}")
    public ResponseEntity<ItemDetailsDto> update(
            @PathVariable Long id,
            @RequestBody @Valid ItemRequestDto itemRequestDto,
            @RequestHeader(value = USER_ID_HEADER, required = false) UUID userId) {
        if (userId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        return ResponseEntity.ok(itemService.updateItem(id, itemRequestDto, userId));
    }

    @PatchMapping(path = "{id}")
    public ResponseEntity<ItemDetailsDto> patch(@PathVariable Long id, @RequestBody JsonNode patch, @RequestHeader(value = USER_ID_HEADER, required = false) UUID userId) {
        if (userId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        return ResponseEntity.ok(itemService.patchItem(id, patch, userId));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ItemDetailsDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItem(id));
    }

    @GetMapping
    public PagedModel<ItemSummaryDto> listItems(
            @ModelAttribute ItemSearch itemSearch,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        if (itemSearch.priceSort() != null)
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize());
        return itemService.listItemsBy(itemSearch, pageable);
    }

    @GetMapping("/me")
    public PagedModel<ItemSummaryDto> listSellerItems(
            @RequestHeader(value = USER_ID_HEADER, required = false) UUID sellerId,
            @ModelAttribute ItemSearch itemSearch,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        if (sellerId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        return itemService.listItemsBy(ItemSearch.withSellerId(sellerId, itemSearch), pageable);
    }

    @GetMapping("/ending-soon")
    public ResponseEntity<List<ItemSummaryDto>> endingSoon(
            @RequestParam(defaultValue = "24") int hours,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(itemService.endingSoonItems(hours, limit));
    }

    @GetMapping("/won")
    public PagedModel<ItemSummaryDto> wonItems(
            @RequestHeader(value = USER_ID_HEADER, required = false) UUID winnerId,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        if (winnerId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        return itemService.listWonItems(winnerId, pageable);
    }

    @PostMapping("{id}/cancel")
    public ResponseEntity<ItemDetailsDto> cancel(@PathVariable Long id, @RequestHeader(value = USER_ID_HEADER, required = false) UUID userId) {
        if (userId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        return ResponseEntity.ok(itemService.cancelItem(id, userId));
    }

}
