package com.mazad.bidding_service.application.auction;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class AuctionClosingScheduler {

    public final CloseExpiredAuctionsService closeExpiredAuctionsService;

    @Scheduled(cron = "0 * * * * *")
    public void closeExpiredAuctions() {
        closeExpiredAuctionsService.closeExpiredAuctions();
    }



}
