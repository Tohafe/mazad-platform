package com.mazad.item.service;

import com.mazad.item.dto.ItemRequestDto;
import com.mazad.item.dto.ItemDetailsDto;
import com.mazad.item.dto.ItemSearch;

import com.mazad.item.dto.ItemSummaryDto;
import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.UUID;

public interface ItemService {

    public ItemDetailsDto createItem(ItemRequestDto itemRequestDto, UUID sellerId);

    public ItemDetailsDto getItem(Long id);

    ItemDetailsDto updateItem(Long id, @Valid ItemRequestDto itemRequestDto);

    void deleteItem(Long id);

    ItemDetailsDto patchItem(Long id, JsonNode jsonPatch);

    public PagedModel<ItemSummaryDto> listItemsBy(ItemSearch itemSearch, Pageable pageable);

    List<ItemSummaryDto> endingSoonItems(int hours, int limit);
}
