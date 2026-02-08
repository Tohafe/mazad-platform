package com.mazad.bidding_service.web.dto;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BidResponse {
    private Long id;
    private Long amount;
    private Long userId;
    private Instant createdAt;
}
