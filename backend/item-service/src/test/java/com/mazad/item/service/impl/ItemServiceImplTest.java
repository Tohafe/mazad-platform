package com.mazad.item.service.impl;

import com.mazad.item.dto.ItemResponse;
import com.mazad.item.entity.AuctionStatus;
import com.mazad.item.entity.ItemEntity;
import com.mazad.item.mapper.ItemMapper;
import com.mazad.item.repository.ItemRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ItemServiceImplTest {
    private final static UUID USER_ID = UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");

    private ItemRepository itemRepoMock;

    private ItemServiceImpl itemService;

    private ItemMapper mapper;

    @BeforeEach
    public void setup() {
        itemRepoMock = mock(ItemRepository.class);
//        itemServiceMock = mock(ItemServiceImpl.class);
        mapper = new ItemMapper();
        itemService = new ItemServiceImpl(mapper, itemRepoMock);
    }

    @Test
    public void ItemService_GetItemById() {
        ItemEntity itemEntity = ItemEntity.builder()
                .id(1L)
                .categoryId(2L)
                .status(AuctionStatus.ACTIVE)
                .sellerId(USER_ID)
                .title("item 1 title")
                .description("item 1 description")
                .startingPrice(BigDecimal.valueOf(150.0))
                .startsAt(Instant.now())
                .endsAt(Instant.MAX).build();
        when(itemRepoMock.findById(1L)).thenReturn(Optional.of(itemEntity));

        ItemResponse result = itemService.getItem(1L);
        Mockito.verify(itemRepoMock).findById(1L);
//        Mockito.verify(itemRepoMock).findAllByStatus(AuctionStatus.ACTIVE);
        Assertions.assertThat(result.title()).isEqualTo(itemEntity.getTitle());
    }
}