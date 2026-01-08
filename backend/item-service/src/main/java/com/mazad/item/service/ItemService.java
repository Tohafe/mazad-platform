package com.mazad.item.service;

import com.mazad.item.dto.ItemRequest;
import com.mazad.item.dto.ItemResponse;
import com.mazad.item.dto.ItemSearch;

import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import tools.jackson.databind.JsonNode;

import java.util.UUID;

public interface ItemService {

    public ItemResponse createItem(ItemRequest itemRequest, UUID sellerId);

    public ItemResponse getItem(Long id);

    public PagedModel<ItemResponse> getItemsPage(int page, int size);

    ItemResponse updateItem(Long id, @Valid ItemRequest itemRequest);

    void deleteItem(Long id);

    ItemResponse patchItem(Long id, JsonNode jsonPatch);

    public PagedModel<ItemResponse> listItemsBy(ItemSearch itemSearch, Pageable pageable);
}
