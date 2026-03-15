package com.mazad.notification.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.NoArgsConstructor;
import java.util.List;
import lombok.Data;


@Data
@NoArgsConstructor
public class FriendsEvent {
    private Long auctionId;
    private String username;
    private List<String> friendIds;

    @JsonProperty("isDelete")   
    private boolean delete;  
}
