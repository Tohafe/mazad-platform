package com.mazad.bidding_service.web.dto;

import java.util.UUID;

public record WalletDto(
    UUID id,
    Long sold
) {}
