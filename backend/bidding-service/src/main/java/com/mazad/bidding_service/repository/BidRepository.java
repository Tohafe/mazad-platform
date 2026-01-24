package com.mazad.bidding_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mazad.bidding_service.domain.Bid;

public interface BidRepository extends JpaRepository<Bid, Long>{

}
