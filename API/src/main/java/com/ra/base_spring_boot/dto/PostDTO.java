package com.ra.base_spring_boot.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDTO {
    private Long id;
    private UserDTO user;
    private String image;
    private Integer likes;
    private String caption;
    private Integer comments;
    private String timestamp;
    private Boolean isLiked;
    private Boolean isSaved;
    private LocalDateTime createdAt;
}
