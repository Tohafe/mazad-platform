package com.mazad.bidding_service.domain.bid;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Entity
@Table(name = "bids")
public class Bid {

    @Id
    @GeneratedValue
    private Long id;

    private Long auctionId;

    private Long bidderId;

    private BigDecimal amount;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private BidStatus status; 
}

// @Table(name = "bid")
// @Entity
// public class Bid {
//     @Id
//     @GeneratedValue
//     private Long id;

//     private BigDecimal amount;

//     private Long userId;

//     @ManyToOne
//     private Auction auction;

//     private LocalDateTime createdAt;
// }
