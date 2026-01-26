package com.mazad.bidding_service.domain;

import java.math.BigDecimal;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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
public class Auction {

    @Id
    @GeneratedValue
    private Long id;

    private boolean open = true;

    private BigDecimal currentPrice;
}