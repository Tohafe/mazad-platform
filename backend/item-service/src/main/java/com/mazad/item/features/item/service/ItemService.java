package com.mazad.item.features.item.service;

import com.mazad.item.features.item.dto.ItemRequest;
import com.mazad.item.features.item.dto.ItemResponse;
import org.springframework.data.web.PagedModel;

import java.util.UUID;

public interface ItemService {

    public ItemResponse createItem(ItemRequest itemRequest, UUID sellerId);

    public ItemResponse getItem(Long id);

    public PagedModel<ItemResponse> getItemsPage(int page, int size);
}
