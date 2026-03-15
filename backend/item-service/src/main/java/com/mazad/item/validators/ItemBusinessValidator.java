package com.mazad.item.validators;

import com.mazad.item.dto.ItemRequestDto;
import com.mazad.item.entity.AuctionStatus;
import com.mazad.item.entity.ItemEntity;
import com.mazad.item.exceptions.AuthorizationException;
import com.mazad.item.exceptions.ItemNotEditableException;
import com.mazad.item.mapper.ItemMapper;
import com.mazad.item.repository.CategoryRepository;
import com.mazad.item.repository.ItemRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public final class ItemBusinessValidator {

    private static final long MIN_DURATION_MINUTES = 5;
    private static final long MAX_DURATION_DAYS = 30;

    private static final Set<String> ALLOWED_PATCH_FIELDS = Set.of(
            "title", "description", "categoryId", "startingPrice", "shippingInfo"
    );

    private final CategoryRepository categoryRepo;

    public void validateCreate(ItemEntity entity) {
        validateCategoryExistence(entity.getCategoryId());
        validateMinDuration(entity.getEndsAt(), entity.getStartsAt());
        validateMaxDuration(entity.getEndsAt(), entity.getStartsAt());
    }

    public void validateUpdate(Long id, ItemEntity entity, UUID userId) {
        if (!entity.getSellerId().equals(userId))
            throw new ValidationException("Item can only be updated by its seller");
        if (entity.getStatus() != AuctionStatus.DRAFT)
            throw new ValidationException("Cannot update item: (Status=" + entity.getStatus() + ")");
        validateCategoryExistence(entity.getCategoryId());
        validateMinDuration(entity.getEndsAt(), entity.getStartsAt());
        validateMaxDuration(entity.getEndsAt(), entity.getStartsAt());
    }

    public void validatePatch(ItemEntity entity, JsonNode node, UUID userId) {
        if (!entity.getSellerId().equals(userId))
            throw new ValidationException("Item can only be updated by its seller");
        if (entity.getStatus() != AuctionStatus.DRAFT)
            throw new ValidationException("Cannot update item: (Status=" + entity.getStatus() + ")");
        if (!node.isObject())
            throw new ValidationException("PATCH node must be an object");

        node.propertyNames().forEach((key) -> {
            if (!ALLOWED_PATCH_FIELDS.contains(key))
                throw new ValidationException("Invalid field for PATCH operation: " + key);
        });

        if (node.has("title")) {
            String title = node.get("title").asString();
            if (title.isBlank())
                throw new ValidationException("Title cannot be blank");
        }
        if (node.has("shippingInfo")) {
            String shippingInfo = node.get("shippingInfo").asString();
            if (shippingInfo.length() > 500)
                throw new ValidationException("shippingInfo cannot be longer than 500 characters");
        }

        if (node.has("description")) {
            String description = node.get("description").asString();
            if (description.length() > 2500)
                throw new ValidationException("description cannot be longer than 2500 characters");
        }

        if (node.has("startingPrice")) {
            long price = node.get("startingPrice").asLong();
            if (price < 0)
                throw new ValidationException("Starting price must be greater than zero");
        }

        if (node.has("categoryId")) {
            Long categoryId = node.get("categoryId").asLong();
            if (!categoryRepo.existsById(categoryId))
                throw new ValidationException("Category does not exist");
        }
    }

    public void validateDelete(ItemEntity entity, UUID userId) {
        if (!entity.getSellerId().equals(userId))
            throw new AuthorizationException("You don't have permission to perform this action.");
        if (entity.getCurrentBid() != null && entity.getCurrentBid() > 0)
            throw new ItemNotEditableException("Item cannot be deleted because it already has bids.");
    }

    private void validateMinDuration(Instant endsAt, Instant startsAt) {
        if (!endsAt.isAfter(startsAt.plus(MIN_DURATION_MINUTES, ChronoUnit.MINUTES)))
            throw new ValidationException("Item must end at least 5 minutes after starts time");
    }

    private void validateMaxDuration(Instant endsAt, Instant startsAt) {
        Duration duration = Duration.between(startsAt, endsAt).abs();
        if (duration.compareTo(Duration.ofDays(MAX_DURATION_DAYS)) > 0)
            throw new ValidationException("Item must end at most " + MAX_DURATION_DAYS + " days after starts time");
    }

    private void validateCategoryExistence(Long categoryId) {
        if (!categoryRepo.existsById(categoryId))
            throw new ValidationException("Category with id " + categoryId + " does not exist");
    }

    public void validateCancel(ItemEntity entity, UUID userId) {
        if (!entity.getSellerId().equals(userId))
            throw new AuthorizationException("You don't have permission to perform this action.");
        if (entity.getStatus() != AuctionStatus.ACTIVE)
            throw new ValidationException("Item already closed");
        if (entity.getCurrentBid() != null && entity.getCurrentBid() > 0)
            throw new ItemNotEditableException("Item cannot be cancelled because it already has bids.");
        if (entity.getEndsAt().isBefore(Instant.now())) {
            throw new ValidationException("Item has already ended and cannot be cancelled.");
        }
    }
}
