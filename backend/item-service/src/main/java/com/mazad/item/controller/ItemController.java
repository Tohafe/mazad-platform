package com.mazad.item.controller;

import com.mazad.item.dto.ItemRequestDto;
import com.mazad.item.dto.ItemDetailsDto;
import com.mazad.item.dto.ItemSearch;
import com.mazad.item.dto.ItemSummaryDto;
import com.mazad.item.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
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
    public ResponseEntity<ItemDetailsDto> create(@RequestBody @Valid ItemRequestDto itemRequestDto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(itemService.createItem(itemRequestDto, CURRENT_USER_ID));
    }

    @PutMapping("{id}")
    public ResponseEntity<ItemDetailsDto> update(@PathVariable Long id, @RequestBody @Valid ItemRequestDto itemRequestDto) {
        return ResponseEntity.ok(itemService.updateItem(id, itemRequestDto));
    }

    @PatchMapping(path = "{id}")
    public ResponseEntity<ItemDetailsDto> patch(@PathVariable Long id, @RequestBody JsonNode patch) {
        return ResponseEntity.ok(itemService.patchItem(id, patch));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDetailsDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItem(id));
    }

    @GetMapping
    public PagedModel<ItemSummaryDto> listItems(
        @ModelAttribute ItemSearch itemSearch,
        @PageableDefault(size = 15, sort = "endsAt", direction = Sort.Direction.ASC) Pageable pageable) {
            return itemService.listItemsBy(itemSearch, pageable);
    }

    private final KafkaTemplate<String, String> kafkaTemplate;
    @PostMapping("/kafka-send")
    public String sendMessage(@RequestParam String message) {
        kafkaTemplate.send("items-topic", message);
        return "Message Sent!: " + message;
    }
}
