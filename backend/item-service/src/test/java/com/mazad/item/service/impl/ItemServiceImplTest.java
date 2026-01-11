package com.mazad.item.service.impl;

import com.mazad.item.dto.ItemRequest;
import com.mazad.item.dto.ItemResponse;
import com.mazad.item.dto.ItemSearch;
import com.mazad.item.entity.AuctionStatus;
import com.mazad.item.entity.ItemEntity;
import com.mazad.item.exceptions.ItemNotEditableException;
import com.mazad.item.exceptions.ResourceNotFoundException;
import com.mazad.item.mapper.ItemMapper;
import com.mazad.item.repository.ItemRepository;
import jakarta.validation.ValidationException;
import org.assertj.core.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.*;
import org.springframework.data.web.PagedModel;
import tools.jackson.databind.json.JsonMapper;


import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ItemServiceImplTest {
    private final static UUID USER_ID = UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");

    private ItemRepository itemRepoMock;

    private ItemServiceImpl itemService;

    private ItemMapper mapper;

    private ItemEntity entity;

    @BeforeEach
    public void setup() {
        itemRepoMock = mock(ItemRepository.class);
//        itemServiceMock = mock(ItemServiceImpl.class);
        mapper = new ItemMapper();
        itemService = new ItemServiceImpl(mapper, itemRepoMock, JsonMapper.builder().build());
        entity = ItemEntity.builder()
                .id(1000L)
                .categoryId(3L)
                .sellerId(USER_ID)
                .title("item 1000")
                .description("desc 1000")
                .status(AuctionStatus.SOLD)
                .startingPrice(BigDecimal.valueOf(100))
                .currentBid(BigDecimal.ZERO)
                .startsAt(Instant.now())
                .endsAt(Instant.MAX)
                .build();
    }

    @Test
    public void createItem_ShouldSaveItem_whenValid() {
        // Arrange
        ItemRequest itemRequest = new ItemRequest(1L, "TestItem 1", "Test Item description 1", AuctionStatus.ACTIVE, BigDecimal.valueOf(100.00), Instant.now(), Instant.parse("2026-12-30T21:43:46.514394Z"));
        when(itemRepoMock.save(any(ItemEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        // Act
        ItemResponse itemResponse = itemService.createItem(itemRequest, USER_ID);
        // Assert
        assertThat(itemResponse).isNotNull();
        assertThat(itemResponse.title()).isEqualTo(itemRequest.title());
        assertThat(itemResponse.sellerId()).isEqualTo(USER_ID);
        assertThat(itemResponse.currentBid()).isEqualTo(BigDecimal.ZERO);
        assertThat(itemResponse.status()).isEqualTo(AuctionStatus.ACTIVE);
    }

    @Test
    public void createItem_throwException_whenInvalidStatus() {
        // Arrange
        ItemRequest itemRequest = new ItemRequest(1L, "TestItem 1", "Test Item description 1", AuctionStatus.SOLD, BigDecimal.valueOf(100.00), Instant.now(), Instant.parse("2026-12-30T21:43:46.514394Z"));
        when(itemRepoMock.save(any(ItemEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
        // Act & Assert
        assertThatThrownBy(() -> itemService.createItem(itemRequest, USER_ID))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Can't create an item with status of " + itemRequest.status());

    }

    @Test
    public void getItem_ShouldReturnItem_whenFound() {
        // Arrange

        when(itemRepoMock.findById(any(Long.class))).thenReturn(Optional.of(entity));
        // Act
        ItemResponse result = itemService.getItem(entity.getId());

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(entity.getId());
        assertThat(result.title()).isEqualTo("item 1000");
        assertThat(result.status()).isEqualTo(AuctionStatus.SOLD);
    }

    @Test
    public void getItem_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(itemRepoMock.findById(any(Long.class))).thenReturn(Optional.empty());
        // Act & Assert
        assertThatThrownBy(() -> itemService.getItem(entity.getId()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Item (" + entity.getId() + ") can't be found");
    }

    @Test
    public void listItemsBy_ShouldReturnValidPage_whenValidPageable() {
        // Arrange
        ItemSearch search = new ItemSearch();
        Pageable pageable = Pageable.ofSize(3).withPage(0);
        Page<ItemEntity> page = new PageImpl<>(List.of(entity, entity, entity), pageable, 3);

        when(itemRepoMock.findAll(any(), any(Pageable.class))).thenReturn(page);
        // Act
        var result = itemService.listItemsBy(search, pageable);
        // Assert

        assertThat(result).isNotNull();
        assertThat(result.getContent().size()).isEqualTo(pageable.getPageSize());

    }

    @Test
    public void listItemsBy_ShouldCreateCorrectQuery_WhenSearching() {
        // Arrange
        ItemSearch search = new ItemSearch(null, null, "Old Watch used by a golem", null, AuctionStatus.SOLD, null, null, null, null);
        Pageable pageable = PageRequest.of(0, 3);
        when(itemRepoMock.findAll(any(Example.class), any(Pageable.class))).thenReturn(Page.empty());
        // Act
        ArgumentCaptor<Example<ItemEntity>> captor = ArgumentCaptor.forClass(Example.class);
        itemService.listItemsBy(search, pageable);
        // Assert
        verify(itemRepoMock).findAll(captor.capture(), eq(pageable));

        Example<ItemEntity> itemProbe = captor.getValue();
        assertThat(itemProbe.getProbe().getTitle()).isEqualTo(search.title());
        assertThat(itemProbe.getProbe().getStatus()).isEqualTo(search.status());

    }

    @Test
    public void updateItem_ShouldNotThrowException_whenDraftItem() {
        // Arrange
        Long id = 100L;
        ItemEntity itemEntity = ItemEntity.builder()
                .id(id)
                .categoryId(3L)
                .sellerId(USER_ID)
                .title("item 100")
                .description("desc 100")
                .status(AuctionStatus.DRAFT)
                .startingPrice(BigDecimal.valueOf(100))
                .currentBid(BigDecimal.ZERO)
                .startsAt(Instant.now())
                .endsAt(Instant.MAX)
                .build();
        ItemRequest itemRequest = mapper.toRequest(itemEntity);

        when(itemRepoMock.findById(id)).thenReturn(Optional.of(itemEntity));
        when(itemRepoMock.save(itemEntity)).thenReturn(itemEntity);
        // Act & Assert
        assertThatCode(() -> itemService.updateItem(id, itemRequest))
                .doesNotThrowAnyException();

    }

    @Test
    public void updateItem_ShouldNotThrowException_whenItemActiveWith0Bids() {
        // Arrange
        Long id = 100L;
        ItemEntity itemEntity = ItemEntity.builder()
                .id(id)
                .categoryId(3L)
                .sellerId(USER_ID)
                .title("item 100")
                .description("desc 100")
                .status(AuctionStatus.ACTIVE)
                .startingPrice(BigDecimal.valueOf(100))
                .currentBid(BigDecimal.ZERO)
                .startsAt(Instant.now())
                .endsAt(Instant.MAX)
                .build();
        ItemRequest itemRequest = mapper.toRequest(itemEntity);

        when(itemRepoMock.findById(id)).thenReturn(Optional.of(itemEntity));
        when(itemRepoMock.save(itemEntity)).thenReturn(itemEntity);
        // Act & Assert
        assertThatCode(() -> itemService.updateItem(id, itemRequest))
                .doesNotThrowAnyException();

    }

    @Test
    public void updateItem_ShouldThrowException_whenActiveAndHasBids() {
        // Arrange
        Long id = 100L;
        ItemEntity itemEntity = ItemEntity.builder()
                .id(id)
                .categoryId(3L)
                .sellerId(USER_ID)
                .title("item 100")
                .description("desc 100")
                .status(AuctionStatus.ACTIVE)
                .startingPrice(BigDecimal.valueOf(100))
                .currentBid(BigDecimal.valueOf(150))
                .startsAt(Instant.now())
                .endsAt(Instant.MAX)
                .build();
        ItemRequest itemRequest = mapper.toRequest(itemEntity);

        when(itemRepoMock.findById(id)).thenReturn(Optional.of(itemEntity));
        when(itemRepoMock.save(itemEntity)).thenReturn(itemEntity);
        // Act & Assert
        assertThatThrownBy(() -> itemService.updateItem(id, itemRequest))
                .isInstanceOf(ItemNotEditableException.class)
                .hasMessage("Item (" + id + ") can't be updated: status = " + itemEntity.getStatus());
    }
}