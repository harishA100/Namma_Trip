package com.nammatrips.dto.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String bio;
    private String avatar;
}
