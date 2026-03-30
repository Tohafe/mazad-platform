package com.mazad.bidding_service.web;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mazad.bidding_service.application.wallet.WalletService;
import com.mazad.bidding_service.domain.exception.AuthorizationException;
import com.mazad.bidding_service.domain.wallet.Wallet;
import com.mazad.bidding_service.web.dto.AvailableBalance;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/wallet")
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<AvailableBalance> getUserAvailableBalance(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId) {
                if (userId == null) throw new AuthorizationException("You don't have permission to perform this action.");
        Wallet wallet =  walletService.getWalletOrThrow(userId);
        
        return ResponseEntity.ok(new AvailableBalance(wallet.getAvailableBalance()));
    }
}
