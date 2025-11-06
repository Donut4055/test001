package com.ra.base_spring_boot.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {
    private Long id;
    private String senderId;
    private String receiverId;
    private String text;
    private String timestamp;
    private Boolean read;
    private String type;
}
