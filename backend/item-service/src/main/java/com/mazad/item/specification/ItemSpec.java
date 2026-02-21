package com.mazad.item.specification;

import com.mazad.item.dto.ItemSearch;
import com.mazad.item.entity.ItemEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ItemSpec {

    private ItemSpec() {}


    public static Specification<ItemEntity> withSearch(ItemSearch search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search.sellerId() != null)
                predicates.add(cb.equal(root.get("sellerId"), search.sellerId()));
            if (search.categoryId() != null)
                predicates.add(cb.equal(root.get("categoryId"), search.categoryId()));
            if (search.status() != null)
                predicates.add(cb.equal(root.get("status"), search.status()));
            if (search.keyword() != null)
                predicates.add(cb.like(root.get("title"), "%" + search.keyword() + "%"));
            if (search.minPrice() != null)
                predicates.add(cb.greaterThanOrEqualTo(root.get("currentBid"), search.minPrice()));
            if (search.maxPrice() != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("currentBid"), search.maxPrice()));
            if (search.endsBefore() != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("endsAt"), search.endsBefore()));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
