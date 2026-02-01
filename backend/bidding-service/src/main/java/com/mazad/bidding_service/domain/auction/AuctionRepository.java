package com.mazad.bidding_service.domain.auction;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionRepository extends JpaRepository<Auction, Long> {

}
