package com.mazad.user_service.repo;

import com.mazad.user_service.entity.FriendshipEntity;
import com.mazad.user_service.entity.ProfileEntity;
import com.mazad.user_service.enums.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FriendshipRepo extends JpaRepository<FriendshipEntity, UUID> {

    @Query("SELECT f FROM FriendshipEntity f " +
            "JOIN FETCH f.requester " +
            "JOIN FETCH f.receiver " +
            "WHERE (f.requester.userId = :userId OR f.receiver.userId = :userId) " +
            "AND f.status = :status"
    )
    List<FriendshipEntity> getAllFriendsByStatus(UUID userId, FriendshipStatus status);

    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END " +
            "FROM FriendshipEntity f " +
            "WHERE (f.requester.userId = :u1 AND f.receiver.userId = :u2) " +
            "OR (f.requester.userId = :u2 AND f.receiver.userId = :u1)"
    )
    boolean friendshipExists(UUID u1, UUID u2);

//    void deleteByRequester(ProfileEntity requester);

    @Query("select f From FriendshipEntity f " +
            "where (f.receiver.userId = :u1 and f.requester.userId = :u2) " +
            "OR (f.receiver.userId = :u2 and f.requester.userId = :u1)")
    Optional<FriendshipEntity> findFriendship(UUID u1, UUID u2);
}
