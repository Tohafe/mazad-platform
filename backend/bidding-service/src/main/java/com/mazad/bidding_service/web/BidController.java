package com.mazad.bidding_service.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.bidding_service.application.bid.BidService;
import com.mazad.bidding_service.domain.bid.Bid;
import com.mazad.bidding_service.web.dto.CreateBidRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;



@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/bids")
public class BidController {

    private final BidService bidService;

    @PostMapping("/{auctionId}")
    public ResponseEntity<ProblemDetail> placeBid(
            @PathVariable Long auctionId,
            @RequestHeader("X-User-Id") UUID userId,
            @Valid @RequestBody CreateBidRequest request) {
        
        log.info("auction ID: {}, and userId{}", auctionId, userId);
        bidService.placeBid(auctionId, userId, request.getAmount());
        
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{auctionId}")
    public List<Bid> getBidsList(
            @PathVariable Long auctionId) {
        
        // log.info("auction ID: {}", auctionId);
        
        List<Bid> lb =   bidService.getBidsList(auctionId);

        // log.info("auction ID: {}, and userId{}", lb.get(0).getAuctionId() , lb.get(0).getBidderId());
        
        return lb;
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