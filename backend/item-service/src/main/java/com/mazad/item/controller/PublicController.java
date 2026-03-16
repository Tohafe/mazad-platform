package com.mazad.item.controller;

import com.mazad.item.dto.ItemDetailsDto;
import com.mazad.item.dto.ItemRequestDto;
import com.mazad.item.dto.ItemSearch;
import com.mazad.item.dto.ItemSummaryDto;
import com.mazad.item.exceptions.AuthorizationException;
import com.mazad.item.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.mazad.item.config.OpenApiConfig.API_KEY_SCHEME;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@SecurityRequirement(name = API_KEY_SCHEME)
@Tag(name = "Public Items", description = "Public endpoints for browsing items, and API-key protected endpoints to manage items.")
public class PublicController {

    private final static String USER_ID_HEADER = "X-User-Id";
    private final ItemService itemService;

    @PostMapping

    @Operation(
            summary = "Create a new item",
            description = "Creates an item using the provided request body."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Item created",
                    content = @Content(schema = @Schema(implementation = ItemDetailsDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request body", content = @Content),
            @ApiResponse(responseCode = "401", description = "Missing/invalid API key", content = @Content)
    })
    public ResponseEntity<ItemDetailsDto> create(
            @Parameter(hidden = true) @RequestHeader(value = USER_ID_HEADER, required = false) UUID userId,
            @RequestBody @Valid ItemRequestDto itemRequestDto) {
        if (userId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(itemService.createItem(itemRequestDto, userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get item by id", description = "Returns full details of a single item.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item found",
                    content = @Content(schema = @Schema(implementation = ItemDetailsDto.class))),
            @ApiResponse(responseCode = "404", description = "Item not found", content = @Content)
    })
    public ResponseEntity<ItemDetailsDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItem(id));
    }

    @GetMapping
    @Operation(
            summary = "List items (search + pagination)",
            description = "Lists items using optional search filters and pageable parameters (page/size/sort)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Page of items returned")
    })
    public PagedModel<ItemSummaryDto> listItems(
            @ModelAttribute ItemSearch itemSearch,
            @PageableDefault(size = 15, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return itemService.listItemsBy(itemSearch, pageable);
    }

    @PutMapping("{id}")

    @Operation(
            summary = "Update an item",
            description = "Replaces editable fields of an existing item."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item updated",
                    content = @Content(schema = @Schema(implementation = ItemDetailsDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request body", content = @Content),
            @ApiResponse(responseCode = "401", description = "Missing/invalid API key", content = @Content),
            @ApiResponse(responseCode = "404", description = "Item not found", content = @Content)
    })
    public ResponseEntity<ItemDetailsDto> update(
            @PathVariable Long id,
            @RequestBody @Valid ItemRequestDto itemRequestDto,
            @RequestHeader(value = USER_ID_HEADER, required = false) UUID userId) {
        if (userId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        return ResponseEntity.ok(itemService.updateItem(id, itemRequestDto, userId));
    }

    @DeleteMapping("{id}")

    @Operation(
            summary = "Delete an item",
            description = "Deletes an item by id."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Item deleted"),
            @ApiResponse(responseCode = "401", description = "Missing/invalid API key", content = @Content),
            @ApiResponse(responseCode = "404", description = "Item not found", content = @Content)
    })
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestHeader(value = USER_ID_HEADER, required = false) UUID userId) {
        if (userId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        itemService.deleteItem(id, userId);
        return ResponseEntity.noContent().build();
    }
}
