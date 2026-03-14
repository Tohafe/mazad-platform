package com.mazad.notification.dto;

import lombok.NoArgsConstructor;
import java.util.List;
import lombok.Data;


@Data
@NoArgsConstructor
public class FriendsEvent {
    private Long auctionId;
    private String username;
    private List<String> friendIds;
    private boolean isDelete;
}
