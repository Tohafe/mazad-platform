package com.mazad.bidding_service.domain.bid;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid, Long>{
    List<Bid> findByAuctionIdOrderByCreatedAtDesc(Long auctionId);

}
