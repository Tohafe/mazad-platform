package com.mazad.bidding_service.application.wallet;

import java.util.UUID;

import org.springframework.stereotype.Service;
import com.mazad.bidding_service.domain.wallet.Wallet;
import com.mazad.bidding_service.domain.wallet.WalletRepository;
import com.mazad.bidding_service.web.dto.TransferResult;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class WalletService {

    private final WalletRepository walletRepository;

    @Transactional
    public Wallet createWalletForNewUser(UUID userId, Long balance) {
        if (walletRepository.existsById(userId)) {
            // throw new IllegalStateException("User already has a wallet!");
            return new Wallet();
        }
        
        Wallet newWallet = new Wallet();
        newWallet.setUserId(userId);
        newWallet.setAvailableBalance(balance);
        newWallet.setReservedBalance(0L);
        
        return walletRepository.save(newWallet);
    }

    @Transactional
    public Long reserveFunds(UUID userId, Long amount) {
        Wallet wallet = getWalletOrThrow(userId);
        
        if (wallet.getAvailableBalance() < amount) {
            throw new IllegalStateException("Insufficient available balance.");
        }

        wallet.setAvailableBalance(wallet.getAvailableBalance() - amount);
        wallet.setReservedBalance(wallet.getReservedBalance() + amount);
        
        walletRepository.save(wallet);
        
        // Return the new available balance
        return wallet.getAvailableBalance();
    }

    @Transactional
    public Long releaseFunds(UUID userId, Long amount) {
        Wallet wallet = getWalletOrThrow(userId);
        
        wallet.setReservedBalance(wallet.getReservedBalance() - amount);
        wallet.setAvailableBalance(wallet.getAvailableBalance() + amount);
        
        walletRepository.save(wallet);

        return wallet.getAvailableBalance();
    }

    @Transactional
    public TransferResult transferReservedFunds(UUID winningBidderId, UUID auctionOwnerId, Long amount) {
        Wallet bidderWallet = getWalletOrThrow(winningBidderId);
        Wallet ownerWallet = getWalletOrThrow(auctionOwnerId);

        // Deduct from the winner's escrow/reserve
        bidderWallet.setReservedBalance(bidderWallet.getReservedBalance() - amount);
        
        // Transfer to the auction owner's usable balance
        ownerWallet.setAvailableBalance(ownerWallet.getAvailableBalance() + amount);

        log.info("bidderWallet.setReservedBalance ==> {}..  ownerWallet.setAvailableBalance: {}",
                 bidderWallet.getReservedBalance(), ownerWallet.getAvailableBalance());
                 
        walletRepository.save(bidderWallet);
        walletRepository.save(ownerWallet);

        return new TransferResult(
            bidderWallet.getAvailableBalance(), 
            ownerWallet.getAvailableBalance()
        );
    }

    /**
     * Helper method to fetch the wallet using the built-in findById
     */
    public Wallet getWalletOrThrow(UUID userId) {
        return walletRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found!"));
    }
}

