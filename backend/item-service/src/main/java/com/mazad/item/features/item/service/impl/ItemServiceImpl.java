package com.mazad.item.features.item.service.impl;

import com.mazad.item.features.item.dto.ItemRequest;
import com.mazad.item.features.item.dto.ItemResponse;
import com.mazad.item.features.item.entity.AuctionStatus;
import com.mazad.item.features.item.entity.ItemEntity;
import com.mazad.item.features.item.mapper.ItemMapper;
import com.mazad.item.features.item.repository.ItemRepository;
import com.mazad.item.features.item.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final ItemMapper mapper;
    private final ItemRepository itemRepo;


    @Override
    public ItemResponse createItem(ItemRequest itemRequest, Long sellerId) {
        ItemEntity entity = mapper.toEntity(itemRequest);
        entity.setSellerId(sellerId);
        entity.setStatus(AuctionStatus.ACTIVE);
        entity.setCurrentBid(BigDecimal.ZERO);
        return mapper.toResponse(itemRepo.save(entity));
    }
}
