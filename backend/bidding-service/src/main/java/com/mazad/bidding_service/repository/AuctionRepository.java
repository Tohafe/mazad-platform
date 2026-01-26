package com.mazad.bidding_service.repository;

import com.mazad.bidding_service.domain.Auction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionRepository extends JpaRepository<Auction, Long> {

}
