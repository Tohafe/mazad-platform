package com.mazad.item.service;

import com.mazad.item.dto.ItemRequest;
import com.mazad.item.dto.ItemDetailsDto;
import com.mazad.item.dto.ItemSearch;

import com.mazad.item.dto.ItemSummaryDto;
import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import tools.jackson.databind.JsonNode;

import java.util.UUID;

public interface ItemService {

    public ItemDetailsDto createItem(ItemRequest itemRequest, UUID sellerId);

    public ItemDetailsDto getItem(Long id);

    ItemDetailsDto updateItem(Long id, @Valid ItemRequest itemRequest);

    void deleteItem(Long id);

    ItemDetailsDto patchItem(Long id, JsonNode jsonPatch);

    public PagedModel<ItemSummaryDto> listItemsBy(ItemSearch itemSearch, Pageable pageable);
}
