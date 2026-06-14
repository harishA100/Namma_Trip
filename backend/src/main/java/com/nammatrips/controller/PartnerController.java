package com.nammatrips.controller;

import com.nammatrips.dto.request.PartnerRequestDto;
import com.nammatrips.dto.response.ApiResponse;
import com.nammatrips.service.PartnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    @PostMapping("/request")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createRequest(
            @Valid @RequestBody PartnerRequestDto request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Partner request created",
                partnerService.createRequest(request, authentication.getName())));
    }

    @GetMapping("/matches")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMatches(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                partnerService.getMatches(authentication.getName())));
    }
}
