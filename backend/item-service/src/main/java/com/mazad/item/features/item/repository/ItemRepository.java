package com.mazad.item.features.item.repository;

import com.mazad.item.features.item.entity.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<ItemEntity, Long> {


}
