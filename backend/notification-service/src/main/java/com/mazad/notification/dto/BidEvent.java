package com.mazad.notification.dto;

import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@NoArgsConstructor
public class BidEvent {
    private Long itemId;      
    private String bidderId;    
    private Double amount;    
    
}