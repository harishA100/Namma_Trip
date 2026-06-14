package com.nammatrips.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String avatar;
    private String bio;
    private Integer xpPoints;
    private String travelLevel;
    private String role;
    private LocalDateTime createdAt;
}
