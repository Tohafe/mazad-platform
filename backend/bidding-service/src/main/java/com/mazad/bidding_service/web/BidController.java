package com.mazad.bidding_service.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.bidding_service.application.bid.BidService;

import com.mazad.bidding_service.web.dto.BidResponse;
import com.mazad.bidding_service.web.dto.CreateBidRequest;

import jakarta.validation.Valid;

import java.util.UUID;

import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@RestController
@RequestMapping("/bids")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping("/{auctionId}")
    public ResponseEntity<ProblemDetail> placeBid(
            @PathVariable Long auctionId,
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreateBidRequest request) {
        
        bidService.placeBid(auctionId, userId, request.getAmount());
        
        return ResponseEntity.ok().build();
    }
    
    // @PostMapping
    // public ResponseEntity<BidResponse> placeBid(@RequestBody @Valid CreateBidRequest request) {
    //     BidResponse bid = bidService.placeBid(
    //         request.getAuctionId(),
    //         request.getUserId(),
    //         request.getAmount()
    //     );
        
    //     return ResponseEntity.status(201).body(bid);
    // }
    
}