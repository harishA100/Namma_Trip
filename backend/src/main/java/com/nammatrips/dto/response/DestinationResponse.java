package com.nammatrips.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class DestinationResponse {
    private Long id;
    private String name;
    private String category;
    private String description;
    private String bestSeason;
    private BigDecimal rating;
    private String images;
    private Double latitude;
    private Double longitude;
    private Boolean savedByCurrentUser;
}
