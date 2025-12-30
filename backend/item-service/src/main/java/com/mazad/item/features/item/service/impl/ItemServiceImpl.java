package com.mazad.item.features.item.service.impl;

import com.mazad.item.features.item.dto.ItemRequest;
import com.mazad.item.features.item.dto.ItemResponse;
import com.mazad.item.features.item.entity.AuctionStatus;
import com.mazad.item.features.item.entity.ItemEntity;
import com.mazad.item.features.item.mapper.ItemMapper;
import com.mazad.item.features.item.repository.ItemRepository;
import com.mazad.item.features.item.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final ItemMapper mapper;
    private final ItemRepository itemRepo;


    @Override
    public ItemResponse createItem(ItemRequest itemRequest, UUID sellerId) {
        ItemEntity entity = mapper.toEntity(itemRequest);
        entity.setSellerId(sellerId);
        entity.setStatus(AuctionStatus.ACTIVE);
        entity.setCurrentBid(BigDecimal.ZERO);
        return mapper.toResponse(itemRepo.save(entity));
    }

    @Override
    public ItemResponse getItem(Long id) {
        ItemEntity entity = itemRepo.findById(id).orElse(null);
        return mapper.toResponse(entity);
    }

}
