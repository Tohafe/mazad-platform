package com.mazad.item.service;

import com.mazad.item.dto.ItemRequestDto;
import com.mazad.item.dto.ItemDetailsDto;
import com.mazad.item.dto.ItemSearch;

import com.mazad.item.dto.ItemSummaryDto;
import com.mazad.item.dto.event.ItemUpdatedEventDto;
import jakarta.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.UUID;

public interface ItemService {

    ItemDetailsDto createItem(ItemRequestDto itemRequestDto, UUID sellerId);

    ItemDetailsDto getItem(Long id);

    ItemDetailsDto updateItem(Long id, @Valid ItemRequestDto itemRequestDto, UUID userId);

    void deleteItem(Long id, UUID userId);

    ItemDetailsDto patchItem(Long id, JsonNode jsonPatch, UUID userId);

    PagedModel<ItemSummaryDto> listItemsBy(ItemSearch itemSearch, Pageable pageable);
    PagedModel<ItemSummaryDto> listWonItems(UUID winnerId, Pageable pageable);

    List<ItemSummaryDto> endingSoonItems(int hours, int limit);

    void applyUpdateEvent(ItemUpdatedEventDto itemEvent);

    ItemDetailsDto cancelItem(Long id, UUID userId);
}
