package com.mazad.item.controller;

import com.mazad.item.dto.ItemRequest;
import com.mazad.item.dto.ItemResponse;
import com.mazad.item.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;
    private final static UUID CURRENT_USER_ID = UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");

    @PostMapping
    public ResponseEntity<ItemResponse> create(@RequestBody @Valid ItemRequest itemRequest) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(itemService.createItem(itemRequest, CURRENT_USER_ID));
    }

    @PutMapping("{id}")
    public ResponseEntity<ItemResponse> update(@PathVariable Long id, @RequestBody @Valid ItemRequest itemRequest) {
        return ResponseEntity.ok(itemService.updateItem(id, itemRequest));
    }

    @PatchMapping(path =  "{id}")
    public ResponseEntity<ItemResponse> patch(@PathVariable Long id, @RequestBody JsonNode patch) {
        return ResponseEntity.ok(itemService.patchItem(id, patch));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItem(id));
    }

    @GetMapping
    public PagedModel<ItemResponse> getAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "3") int size) {
        return itemService.getItemsPage(page, size);
    }
}
