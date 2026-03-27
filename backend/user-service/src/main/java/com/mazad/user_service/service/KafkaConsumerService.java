package com.mazad.user_service.service;

import java.util.List;
import java.util.UUID;

import com.mazad.user_service.dto.CurrentUser;
import com.mazad.user_service.dto.FriendResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.mazad.user_service.dto.event.ItemEvent;
import com.mazad.user_service.dto.event.NotifyFriendsEvent;
import com.mazad.user_service.enums.FriendshipStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

@Service
@Slf4j
@RequiredArgsConstructor

public class KafkaConsumerService {
    private final FriendshipService friendService;
    private final ProfileService profileService;
    private final JsonMapper jsonMapper;
    private final KafkaProducerService producer;

    @Value("${notify.friends.topic}")
    String notifyFriendsTopic;

    @Value("${item.created.topic}")
    String itemCreatedTopic;
    

    @KafkaListener(topics = {"${item.created.topic}", "${item.updated.topic}"}, groupId = "user-service")
    public void processItemEvents(String event, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic){
        boolean isDelete = true;

        if (topic.equals(itemCreatedTopic))
            isDelete = false;
        try{
            ItemEvent itemEvent = jsonMapper
                        .readerFor(ItemEvent.class)
                        .readValue(event);
            List<UUID> friendIds = friendService
                    .getFriendByStatus(itemEvent.sellerId(), FriendshipStatus.ACCEPTED)
                    .stream()
                    .map(FriendResponseDto::id)
                    .toList();
            String sellerName = profileService
                    .getPrivateProfile(itemEvent.sellerId())
                    .username();
            if (friendIds.isEmpty()){
                NotifyFriendsEvent notifyEvent = NotifyFriendsEvent.builder()
                        .auctionId(itemEvent.id())
                        .username(sellerName)
                        .friendIds(friendIds)
                        .isDelete(isDelete)
                        .build();
                producer.produce(notifyFriendsTopic, notifyEvent);
            }

        }catch(RuntimeException e){
            log.info("Failed to parse event on user-service : " + e.getMessage());
        }

    }

    @KafkaListener(topics = "${auth-user.sync.topic}", groupId = "user-service")
    public void processAuthEvents(String event){
        try{
            CurrentUser userData = jsonMapper
                    .readerFor(CurrentUser.class)
                    .readValue(event);
            ObjectNode node = jsonMapper.createObjectNode();
            if (userData.email() != null && !userData.email().isBlank())
                node.put("email", userData.email());
            if (userData.username() != null && !userData.username().isBlank())
                node.put("username", userData.username());
            if (userData.id() != null)
                node.put("userId", userData.id().toString());
            if (userData.firstName() != null && !userData.firstName().isBlank())
                node.put("firstName", userData.firstName());
            if (userData.lastName() != null && !userData.lastName().isBlank())
                node.put("lastName", userData.lastName());
            if (userData.avatarImageId() != null && !userData.avatarImageId().isBlank())
                node.put("avatarImageId", userData.avatarImageId());
            if (userData.avatarUrl() != null && !userData.avatarUrl().isBlank())
                node.put("avatarUrl", userData.avatarUrl());
            if (userData.avatarThumbnailUrl() != null && !userData.avatarThumbnailUrl().isBlank())
                node.put("avatarThumbnailUrl", userData.avatarThumbnailUrl());

            profileService.patch(userData.id(), node, true);
        }catch(RuntimeException e){
            log.info("Failed to parse event on user-service : " + e.getMessage());
        }
    }

}
