package com.mazad.auth.scheduling_tasks;

import java.time.Instant;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mazad.auth.repo.RefreshTokenRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasks {

    private final    RefreshTokenRepo tokenRepo;

    //Every 20 min
    @Scheduled(cron="0 */20 * * * *")
    public void scheduledRefreshTokensCleanUp(){
        Instant date = Instant.now();
        int deletedTokens = tokenRepo.deleteExpiredTokens(date);
        log.info("Refresh Token Schedule Start At {}", date);
        log.info("Number Of Deleted Expiry Tokens is : {}", deletedTokens);
    }
}
