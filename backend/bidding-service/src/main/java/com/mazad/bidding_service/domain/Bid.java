package com.mazad.bidding_service.domain;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bid")
@Entity
public class Bid {
    @Id
    @GeneratedValue
    private Long id;

    private BigDecimal amount;

    private Long userId;

    @ManyToOne
    private Auction auction;

    private LocalDateTime createdAt;
}
