package com.mazad.bidding_service.application.auction;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

import com.mazad.bidding_service.infrastructure.kafka.AuctionUpdateProducer;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import com.mazad.bidding_service.domain.auction.Auction;
import com.mazad.bidding_service.domain.auction.AuctionRepository;
import com.mazad.bidding_service.domain.auction.AuctionStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloseExpiredAuctionsService {

    final public AuctionRepository auctionRepository;
    private final AuctionUpdateProducer auctionUpdateProducer;

    public void closeExpiredAuctions() {
        log.info("Cron triggered at {}",  OffsetDateTime.now());

        List<Auction> expiredAuctions  = auctionRepository.findAllByStatusAndEndsAtLessThanEqual(
                                        AuctionStatus.ACTIVE, Instant.now().plusSeconds(1));

        for (Auction auction : expiredAuctions) {
            try {
                closeAuction(auction);
            } catch (ObjectOptimisticLockingFailureException e) {
                log.warn("Race condition: Auction {} was updated by a last-second bid. Will check again next minute.", auction.getAuctionId());
            } catch (Exception e) {
                log.error("Error closing auction {}: {}", auction.getAuctionId(), e.getMessage());
            }
        }
    }

    public void closeAuction(Auction auction) {
        auction.setStatus(AuctionStatus.CLOSED);
        auctionRepository.save(auction);

        // auctionUpdateProducer.sendUpdate(auction); 
        log.info("Auction {} has been closed successfully.", auction.getAuctionId());

        // Trigger the Kafka event
        auctionUpdateProducer.sendUpdate(auction);
    }
}
