package com.mazad.item.service;

import com.mazad.item.dto.ItemRequest;
import com.mazad.item.dto.ItemResponse;
import org.springframework.data.web.PagedModel;

import java.util.UUID;

public interface ItemService {

    public ItemResponse createItem(ItemRequest itemRequest, UUID sellerId);

    public ItemResponse getItem(Long id);

    public PagedModel<ItemResponse> getItemsPage(int page, int size);
}
