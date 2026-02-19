package com.mazad.item.controller;

import com.mazad.item.dto.CategorizedItemsDto;
import com.mazad.item.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
public class CatalogController {
    private final CatalogService catalogService;


    @GetMapping()
    public ResponseEntity<List<CategorizedItemsDto>> getCategorizedItems(
            @RequestParam(value = "categories_limit", defaultValue = "6") int categoriesLimit,
            @RequestParam(value = "items_limit", defaultValue = "4") int itemsLimit
    ) {
        return ResponseEntity.ok(catalogService.getCategorizedItems(categoriesLimit, itemsLimit));
    }
}
