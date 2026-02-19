package com.mazad.item.repository;

import com.mazad.item.dto.ItemSummaryDto;
import com.mazad.item.entity.AuctionStatus;
import com.mazad.item.entity.ItemEntity;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import java.time.Instant;
import java.util.List;

public interface ItemRepository extends JpaRepository<ItemEntity, Long>, QueryByExampleExecutor<ItemEntity> {

    Page<ItemEntity> findAllByStatus(AuctionStatus status, Pageable pageable);

    @Query("""
            SELECT item FROM ItemEntity item
            WHERE item.status = 'ACTIVE' AND item.endsAt BETWEEN :startDate AND :endDate
            ORDER BY item.endsAt ASC, item.id ASC
            """)
    List<ItemEntity> findAllBetween(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate, Limit limit
    );
}