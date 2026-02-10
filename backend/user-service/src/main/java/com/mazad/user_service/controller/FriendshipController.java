package com.mazad.user_service.controller;

import com.mazad.user_service.dto.FriendRequestsDto;
import com.mazad.user_service.dto.FriendResponseDto;
import com.mazad.user_service.enums.FriendshipStatus;
import com.mazad.user_service.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
public class FriendshipController {
    private final FriendshipService service;


    @GetMapping
    public ResponseEntity<List<FriendResponseDto>> getAllFriends(
            @RequestHeader("X-User-Id") UUID userId
    ) {
        List<FriendResponseDto> response;

        response = service.getFriendByStatus(userId, FriendshipStatus.ACCEPTED);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/request/{userName}")
    public ResponseEntity<Void> addFriend(
            @RequestHeader("X-User-Id") UUID requesterId,
            @PathVariable("userName") String userName
    ) {
        service.addOrUnFriendUser(requesterId, userName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequestsDto>> pendingFriendRequests(
            @RequestHeader("X-User-Id") UUID userId
    ) {
        List<FriendRequestsDto> response;

        response = service.getFriendByStatus(userId, FriendshipStatus.PENDING)
                .stream()
                .map(res -> FriendRequestsDto
                        .builder()
                        .userName(res.userName())
                        .thumbnail(res.thumbnail())
                        .status(FriendshipStatus.PENDING.toString())
                        .build())
                .toList();
        return ResponseEntity.ok(response);
    }
}
