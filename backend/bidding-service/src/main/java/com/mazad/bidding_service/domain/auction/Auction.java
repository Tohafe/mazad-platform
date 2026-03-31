package com.mazad.bidding_service.domain.auction;

import java.time.Instant;
import java.util.UUID;

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
    @Column(name = "auction_id", nullable = false)
    private Long auctionId; 
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length=20)
    private AuctionStatus status;

    @Column(nullable = false)
    private UUID sellerId;
    
    @Column(name = "starting_price", nullable = false)
    private Long startingPrice;
    
    @Column(name = "current_highest_bid")
    private Long currentHighestBid;
    
    @Column(name = "current_highest_bidder_id")
    private UUID currentHighestBidderId;
    
    @Column(name = "ends_at", nullable = false)
    private Instant endsAt;
    
    @Version
    @Column(nullable = false)
    private Long version; // optimistic locking
}
