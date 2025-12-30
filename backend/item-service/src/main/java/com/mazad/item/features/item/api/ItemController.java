package com.mazad.item.features.item.api;

import com.mazad.item.features.item.dto.ItemRequest;
import com.mazad.item.features.item.dto.ItemResponse;
import com.mazad.item.features.item.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponse> create(@RequestBody @Valid ItemRequest itemRequest) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(itemService.createItem(itemRequest, UUID.randomUUID()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        ItemResponse itemResponse = itemService.getItem(id);
        return ResponseEntity.ofNullable(itemResponse);
    }
}
