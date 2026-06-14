package com.nammatrips.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExperienceRequest {
    @NotBlank(message = "Destination is required")
    private String destination;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private BigDecimal rating;
    private String images;
}
