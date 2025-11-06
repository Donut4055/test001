package com.ra.base_spring_boot.repository;

import com.ra.base_spring_boot.model.Notification;
import com.ra.base_spring_boot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    
    Long countByUserAndIsReadFalse(User user);
}
