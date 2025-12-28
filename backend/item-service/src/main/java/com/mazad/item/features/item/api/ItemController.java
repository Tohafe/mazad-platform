package com.mazad.item.features.item.api;

import com.mazad.item.features.item.dto.ItemRequest;
import com.mazad.item.features.item.dto.ItemResponse;
import com.mazad.item.features.item.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/v1/items")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;

    @PostMapping
    public ResponseEntity<ItemResponse> create(@RequestBody @Valid ItemRequest itemRequest) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(itemService.createItem(itemRequest, 101L));
    }
}
