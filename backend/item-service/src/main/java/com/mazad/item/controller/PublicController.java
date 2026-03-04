package com.mazad.item.controller;

import com.mazad.item.dto.ItemDetailsDto;
import com.mazad.item.dto.ItemRequestDto;
import com.mazad.item.dto.ItemSearch;
import com.mazad.item.dto.ItemSummaryDto;
import com.mazad.item.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class PublicController {

    private final static String API_KEY_HEADER = "X-API-KEY";
    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemDetailsDto> createItem(@RequestBody ItemRequestDto itemRequestDto, @RequestHeader(API_KEY_HEADER)UUID apiKey) {
        return ResponseEntity.ok(itemService.createItem(itemRequestDto, apiKey));
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

    @PutMapping("{id}")
    public ResponseEntity<ItemDetailsDto> update(
            @PathVariable Long id,
            @RequestBody @Valid ItemRequestDto itemRequestDto,
            @RequestHeader(API_KEY_HEADER) UUID apiKey) {
        return ResponseEntity.ok(itemService.updateItem(id, itemRequestDto, apiKey));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestHeader(API_KEY_HEADER) UUID apiKey) {
        itemService.deleteItem(id, apiKey);
        return ResponseEntity.noContent().build();
    }
}
