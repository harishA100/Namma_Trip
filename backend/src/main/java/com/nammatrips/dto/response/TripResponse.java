package com.nammatrips.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class TripResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String destination;
    private Integer duration;
    private BigDecimal budget;
    private String itinerary;
    private String status;
    private String companions;
    private String interests;
    private LocalDateTime createdAt;
}
