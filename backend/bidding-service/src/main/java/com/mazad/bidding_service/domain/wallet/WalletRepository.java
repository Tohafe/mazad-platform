package com.mazad.bidding_service.domain.wallet;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, UUID> {
    
    // // Returns an Optional because a user might not have a wallet yet
    // Optional<Wallet> findByUserId(Long userId);
    
    // boolean existsByUserId(Long userId);
}
