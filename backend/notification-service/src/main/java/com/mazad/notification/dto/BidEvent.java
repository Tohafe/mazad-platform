package com.mazad.notification.dto;
import lombok.NoArgsConstructor;
import java.time.Instant;
import lombok.Data;




@Data
@NoArgsConstructor
public class BidEvent {
    private Long auctionId;
    private Long currentHighestBid;
    private Instant endsAt;      
    private AuctionStatus status;       
    private String lastBidderId;
    private String previousBidderId;
}