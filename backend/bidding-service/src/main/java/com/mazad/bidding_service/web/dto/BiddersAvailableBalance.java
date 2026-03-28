package com.mazad.bidding_service.web.dto;

public record BiddersAvailableBalance(
    Long lastBidder,
    Long previoseBidder
) {}
// @Naoufal