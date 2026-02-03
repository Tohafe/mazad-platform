package com.mazad.user_service.service;

import com.mazad.user_service.dto.FriendResponseDto;
import com.mazad.user_service.entity.FriendshipEntity;
import com.mazad.user_service.entity.ProfileEntity;
import com.mazad.user_service.enums.FriendshipStatus;
import com.mazad.user_service.exception.ResourceNotFoundException;
import com.mazad.user_service.mapper.FriendshipMapper;
import com.mazad.user_service.repo.FriendshipRepo;
import com.mazad.user_service.repo.ProfileRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendshipService {
    private final FriendshipRepo    friendRepo;
    private final ProfileRepo       profileRepo;
    private final FriendshipMapper  mapper;
    private FriendshipEntity        entity;

    @Transactional
    public void addOrUnFriendUser(UUID requesterId, String userName) {

        ProfileEntity requester = profileRepo
                .findByUserId(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("The requester doesn't exist or doesn't have a profile!"));
        ProfileEntity receiver = profileRepo
                .findByUserName(userName)
                .orElseThrow(() -> new ResourceNotFoundException("The receiver doesn't exist or doesn't have a profile!"));
        if (requesterId.equals(receiver.getUserId()))
            return;
        if (friendRepo.friendshipExists(requesterId, receiver.getUserId())){
            entity = friendRepo.findFriendship(requesterId, receiver.getUserId()).get();
            log.info("\nEntity Found Id = {}\n", entity.getId());
            if (entity.getStatus().equals(FriendshipStatus.ACCEPTED) || entity.getRequester().getUserId().equals(requesterId))
                friendRepo.delete(entity);
            else
                entity.setStatus(FriendshipStatus.ACCEPTED);
        }
        else{
            entity = FriendshipEntity
                .builder()
                .requester(requester)
                .receiver(receiver)
                .status(FriendshipStatus.PENDING)
                .build();
            friendRepo.save(entity);
        }
    }

    public List<FriendResponseDto> getFriendByStatus(UUID userId, FriendshipStatus status) {
        List<FriendshipEntity> friends;

        friends = friendRepo.getAllFriendsByStatus(userId, status);
        if (friends.isEmpty())
            throw new ResourceNotFoundException("The user has no friends!");
        return friends
                .stream()
                .map(friendship -> {
                    if (!friendship.getRequester().getUserId().equals(userId))
                        return mapper.toFriendshipResponseDto(friendship.getRequester());
                    else
                        return mapper.toFriendshipResponseDto(friendship.getReceiver());
                }).toList();
    }
}
