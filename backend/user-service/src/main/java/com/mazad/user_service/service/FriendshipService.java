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
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    private final StringRedisTemplate redisTemplate;

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
        FriendshipEntity entity;
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

    private List<FriendResponseDto> getFriendsWithOnlineStatus(List<ProfileEntity> friends){
        List<String> values = new ArrayList<>();
        List<String> keys = friends
                .stream()
                .map(f -> "user:online:" + f.getUserId())
                .toList();
        try {
            values = redisTemplate
                    .opsForValue()
                    .multiGet(keys);
        }catch(RuntimeException e){
            log.error("Redis is down, skipping online status: {}", e.getMessage());
        }
        List<FriendResponseDto> response = new ArrayList<>();

        for(int i = 0; i < friends.size(); i++){
            boolean isOnline = false;

            if (values != null && !values.isEmpty())
                isOnline = values.get(i) != null;
            response.add(mapper.toFriendshipResponseDto(friends.get(i), isOnline));
        }

        return response;
    }

    public List<FriendResponseDto> getFriendByStatus(UUID userId, FriendshipStatus status) {
        List<FriendshipEntity> friendships;
        List<ProfileEntity> friends;

        friendships = friendRepo.getAllFriendsByStatus(userId, status);
        if (friendships.isEmpty())
            return  new ArrayList<>();
        if (status.equals(FriendshipStatus.PENDING)) {
            friendships = friendships
                    .stream()
                    .filter(f -> !f.getRequester().getUserId().equals(userId))
                    .toList();
        }
        friends = friendships
                .stream()
                .map(friendship -> {
                    if (!friendship.getRequester().getUserId().equals(userId))
                        return friendship.getRequester();
                    else
                        return friendship.getReceiver();
                }).toList();
        if (status.equals(FriendshipStatus.PENDING))
            return friends.stream().map(f -> mapper.toFriendshipResponseDto(f, false)).toList();
        return getFriendsWithOnlineStatus(friends);
    }
}
