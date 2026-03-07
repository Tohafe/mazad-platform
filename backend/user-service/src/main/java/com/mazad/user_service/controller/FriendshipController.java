package com.mazad.user_service.controller;

import com.mazad.user_service.dto.FriendRequestsDto;
import com.mazad.user_service.dto.FriendDto;
import com.mazad.user_service.dto.FriendResponseDto;
import com.mazad.user_service.enums.FriendshipStatus;
import com.mazad.user_service.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    @PostMapping("/request/{username}")
    public ResponseEntity<FriendshipStatus> addFriend(
            @RequestHeader("X-User-Id") UUID requesterId,
            @PathVariable("username") String username
    ) {
        FriendshipStatus status = service.addOrUnFriendUser(requesterId, username);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/{friendId}")
    public ResponseEntity<FriendDto> getFriend(@RequestHeader("X-User-Id") UUID userId, @PathVariable("friendId") UUID friendId){
        FriendDto friend = service.getFriendById(userId, friendId);

        return ResponseEntity.ok(friend);
    }

    @GetMapping("/requests")
    public ResponseEntity<List<FriendRequestsDto>> pendingFriendRequests(
            @RequestHeader("X-User-Id") UUID userId
    ) {
        List<FriendRequestsDto> response;

        response = service.getFriendByStatus(userId, FriendshipStatus.PENDDING)
                .stream()
                .map(res -> FriendRequestsDto
                        .builder()
                        .username(res.username())
                        .thumbnail(res.thumbnail())
                        .status(FriendshipStatus.PENDDING.toString())
                        .build())
                .toList();
        return ResponseEntity.ok(response);
    }
}
