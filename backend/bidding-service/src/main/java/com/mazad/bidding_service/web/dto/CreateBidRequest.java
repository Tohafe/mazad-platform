package com.mazad.bidding_service.web.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBidRequest {

    @NotNull
    private Long auctionId;

    @NotNull
    private Long userId;

    @NotNull
    @Positive
    private BigDecimal amount;

}
