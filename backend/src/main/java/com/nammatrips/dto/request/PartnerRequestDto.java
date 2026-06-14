package com.nammatrips.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PartnerRequestDto {
    @NotBlank(message = "Destination is required")
    private String destination;

    private LocalDate travelDate;
    private String interests;
    private String travelStyle;
}
