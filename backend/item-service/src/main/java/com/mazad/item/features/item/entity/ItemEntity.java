package com.mazad.item.features.item.entity;

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

    @NotNull
    private Long categoryId;

    @NotNull
    private UUID sellerId;

    @NotNull
    private String title;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AuctionStatus status;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    private BigDecimal startingPrice;

    @NotNull
    private BigDecimal currentBid;

    @NotNull @FutureOrPresent
    private Instant startsAt;

    @NotNull @Future
    private Instant endsAt;


}
