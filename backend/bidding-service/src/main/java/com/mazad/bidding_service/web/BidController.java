package com.mazad.bidding_service.web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.bidding_service.application.bid.BidService;
import com.mazad.bidding_service.application.wallet.WalletService;
import com.mazad.bidding_service.domain.bid.Bid;
import com.mazad.bidding_service.domain.exception.AuthorizationException;
import com.mazad.bidding_service.domain.wallet.Wallet;
import com.mazad.bidding_service.web.dto.AvailableBalance;
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
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/bids")
public class BidController {

    private final BidService bidService;
    private final WalletService walletService;

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

    @GetMapping("/wallet")
    public ResponseEntity<AvailableBalance> getUserAvailableBalance(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId) {
                if (userId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        Wallet wallet =  walletService.getWalletOrThrow(userId);
        
        return ResponseEntity.ok(new AvailableBalance(wallet.getAvailableBalance()));
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