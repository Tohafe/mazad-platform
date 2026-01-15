package com.mazad.item.service;

import com.mazad.item.dto.CategoryDto;
import com.mazad.item.entity.CategoryEntity;
import com.mazad.item.exceptions.ResourceNotFoundException;
import com.mazad.item.mapper.CategoryMapper;
import com.mazad.item.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repository;
    private final CategoryMapper mapper;

    public List<CategoryDto> getAllCategories() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryDto getCategoryById(Long id) {
        CategoryEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category (" + id + ") can't be found"));
        return mapper.toResponse(entity);
    }
}
