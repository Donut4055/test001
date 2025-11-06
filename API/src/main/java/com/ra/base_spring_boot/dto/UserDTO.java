package com.ra.base_spring_boot.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String avatar;
    private String bio;
    private Integer followers;
    private Integer following;
    private Integer posts;
    private Boolean isPrivate;
    private Boolean isFollowing;
    private Boolean followRequestPending;
    private Boolean followsYou;
    private Boolean isOnline;
}
