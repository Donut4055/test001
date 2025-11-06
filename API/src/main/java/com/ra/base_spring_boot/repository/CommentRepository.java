package com.ra.base_spring_boot.repository;

import com.ra.base_spring_boot.model.Comment;
import com.ra.base_spring_boot.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
    
    Long countByPost(Post post);
}
