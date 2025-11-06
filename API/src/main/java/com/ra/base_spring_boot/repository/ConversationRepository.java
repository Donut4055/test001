package com.ra.base_spring_boot.repository;

import com.ra.base_spring_boot.model.Conversation;
import com.ra.base_spring_boot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p = :user ORDER BY c.updatedAt DESC")
    List<Conversation> findByParticipantsContaining(User user);
    
    @Query("SELECT c FROM Conversation c JOIN c.participants p1 JOIN c.participants p2 WHERE p1 = :user1 AND p2 = :user2")
    Optional<Conversation> findByTwoParticipants(User user1, User user2);
}
