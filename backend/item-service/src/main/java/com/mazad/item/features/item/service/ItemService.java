package com.mazad.item.features.item.service;

import com.mazad.item.features.item.dto.ItemRequest;
import com.mazad.item.features.item.dto.ItemResponse;

public interface ItemService {

    public ItemResponse createItem(ItemRequest itemRequest, Long sellerId);
}
