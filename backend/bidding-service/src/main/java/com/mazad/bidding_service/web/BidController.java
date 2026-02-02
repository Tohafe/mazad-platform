package com.mazad.bidding_service.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.bidding_service.application.bid.BidService;

import com.mazad.bidding_service.web.dto.BidResponse;
import com.mazad.bidding_service.web.dto.CreateBidRequest;

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
    public ResponseEntity<BidResponse> placeBid(@RequestBody @Valid CreateBidRequest request) {
        BidResponse bid = bidService.placeBid(
            request.getAuctionId(),
            request.getUserId(),
            request.getAmount()
        );
        
        return ResponseEntity.status(201).body(bid);
    }
    
}