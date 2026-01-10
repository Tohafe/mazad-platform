package com.mazad.item.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "items")
@AllArgsConstructor
@NoArgsConstructor
@Getter 
@Setter
@Builder
public class ItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long categoryId;

    @Column(nullable = false)
    private UUID sellerId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuctionStatus status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal startingPrice;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal currentBid;

    @Column(nullable = false)
    private Instant startsAt;

    @Column(nullable = false)
    private Instant endsAt;


}
