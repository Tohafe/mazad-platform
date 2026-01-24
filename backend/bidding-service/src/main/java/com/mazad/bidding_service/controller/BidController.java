package com.mazad.bidding_service.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.bidding_service.domain.Bid;
import com.mazad.bidding_service.dto.CreateBidRequest;
import com.mazad.bidding_service.service.BidService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/bids")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping
    public ResponseEntity<Bid> placeBid(@RequestBody @Valid CreateBidRequest request) {
        Bid bid = bidService.placeBid(
            request.getAuctionId(),
            request.getUserId(),
            request.getAmount()
        );
        
        return ResponseEntity.status(201).body(bid);
    }
    
}