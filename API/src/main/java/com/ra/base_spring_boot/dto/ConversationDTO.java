package com.ra.base_spring_boot.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDTO {
    private Long id;
    private List<UserDTO> participants;
    private MessageDTO lastMessage;
    private Integer unreadCount;
    private String updatedAt;
}
