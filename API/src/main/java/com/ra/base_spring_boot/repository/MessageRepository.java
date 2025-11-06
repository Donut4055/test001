package com.ra.base_spring_boot.repository;

import com.ra.base_spring_boot.model.Conversation;
import com.ra.base_spring_boot.model.Message;
import com.ra.base_spring_boot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationOrderByCreatedAtAsc(Conversation conversation);
    
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.createdAt ASC")
    List<Message> findMessagesBetweenUsers(User user1, User user2);
    
    Long countByReceiverAndIsReadFalse(User receiver);
}
