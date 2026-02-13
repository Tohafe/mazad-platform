package com.mazad.item.service;

import com.mazad.item.dto.CategorizedItemsDto;
import com.mazad.item.dto.ItemSearch;
import com.mazad.item.dto.ItemSummaryDto;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogService {
    private final ItemService itemService;
    private final CategoryService categoryService;

    public List<CategorizedItemsDto> getCategorizedItems(int categoriesLimit, int itemsLimit) {
        if (categoriesLimit <= 0 || itemsLimit <= 0)
            throw new ValidationException("categories_limit and items_limit must be positive integers");
        return categoryService.getAllCategories().stream()
                .limit(categoriesLimit)
                .map(category -> {
                    PagedModel<ItemSummaryDto> itemsPage = itemService.listItemsBy(new ItemSearch(), PageRequest.of(0, itemsLimit));
                    return new CategorizedItemsDto(category, itemsPage.getContent());
                })
                .toList();
    }
}
