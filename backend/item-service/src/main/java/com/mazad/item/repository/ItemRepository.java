package com.mazad.item.repository;

import com.mazad.item.entity.AuctionStatus;
import com.mazad.item.entity.ItemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.QueryByExampleExecutor;

public interface ItemRepository extends JpaRepository<ItemEntity, Long>, QueryByExampleExecutor<ItemEntity> {

    Page<ItemEntity> findAllByStatus(AuctionStatus status, Pageable pageable);
}