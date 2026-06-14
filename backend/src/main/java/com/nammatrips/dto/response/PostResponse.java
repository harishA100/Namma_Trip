package com.nammatrips.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;
    private Long destinationId;
    private String destinationName;
    private String images;
    private String caption;
    private Integer likeCount;
    private Boolean likedByCurrentUser;
    private Integer commentCount;
    private LocalDateTime createdAt;
}
