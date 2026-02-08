package com.mazad.bidding_service.domain.bid;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.OffsetDateTime;

import com.mazad.bidding_service.domain.auction.Auction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @Column(name  = "bidder_id", nullable = false)
    private Long bidderId;

    @Column(nullable = false, precision = 19, scale = 2)
    private Long amount;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    // @Enumerated(EnumType.STRING)
    // @Column(nullable = false, length = 20)
    // private BidStatus status; 

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
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
