package com.nammatrips.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostCreateRequest {
    @NotBlank(message = "Caption is required")
    private String caption;
    
    private Long destinationId;
    private String images;
}
