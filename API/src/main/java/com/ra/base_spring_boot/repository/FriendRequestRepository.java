package com.ra.base_spring_boot.repository;

import com.ra.base_spring_boot.model.FriendRequest;
import com.ra.base_spring_boot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findByToUserAndStatus(User toUser, FriendRequest.RequestStatus status);
    
    List<FriendRequest> findByFromUserAndStatus(User fromUser, FriendRequest.RequestStatus status);
    
    Optional<FriendRequest> findByFromUserAndToUser(User fromUser, User toUser);
    
    boolean existsByFromUserAndToUserAndStatus(User fromUser, User toUser, FriendRequest.RequestStatus status);
}
