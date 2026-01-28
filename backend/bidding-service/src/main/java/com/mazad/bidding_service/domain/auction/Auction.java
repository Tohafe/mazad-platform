package com.mazad.bidding_service.domain.auction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "auctions")
public class Auction {
    
    @Id
    private Long auctionId; 
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length=20)
    private AuctionStatus status;
    
    @Column(name = "starting_rice", nullable = false )
    private BigDecimal startingPrice;
    
    @Column(name = "current_highest_bid", nullable = false)
    private BigDecimal currentHighestBid;
    
    @Column(name = "current_highest_bidder_id", nullable = false)
    private Long currentHighestBidderId;
    
    @Column(name = "ents_at", nullable = false)
    private LocalDateTime endsAt;
    
    @Version
    private Long version; // optimistic locking (VERY important)
}

// public class Auction {

//     @Id
//     @GeneratedValue
//     private Long id;

//     private boolean open = true;

//     private BigDecimal highestBid;

// }