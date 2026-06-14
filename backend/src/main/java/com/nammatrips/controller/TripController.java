package com.nammatrips.controller;

import com.nammatrips.dto.request.TripGenerateRequest;
import com.nammatrips.dto.response.ApiResponse;
import com.nammatrips.dto.response.TripResponse;
import com.nammatrips.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<TripResponse>> generateTrip(
            @Valid @RequestBody TripGenerateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Trip generated successfully",
                tripService.generateTrip(request, authentication.getName())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripResponse>>> getUserTrips(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(tripService.getUserTrips(authentication.getName())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripResponse>> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(tripService.getTripById(id)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TripResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(tripService.updateTripStatus(id, body.get("status"))));
    }
}
