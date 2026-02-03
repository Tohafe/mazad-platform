package com.mazad.bidding_service.domain.auction;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionRepository extends JpaRepository<Auction, Long> {

    public List<Auction> findAllByStatusAndEndsAtLessThanEqual(AuctionStatus auctionStatus, Instant date);
}
