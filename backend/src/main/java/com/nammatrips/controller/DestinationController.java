package com.nammatrips.controller;

import com.nammatrips.dto.response.ApiResponse;
import com.nammatrips.dto.response.DestinationResponse;
import com.nammatrips.entity.User;
import com.nammatrips.repository.UserRepository;
import com.nammatrips.service.DestinationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DestinationResponse>>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {
        Long userId = getUserId(authentication);
        Page<DestinationResponse> result = category != null
                ? destinationService.getByCategory(category, page, size, userId)
                : destinationService.getAllDestinations(page, size, userId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<DestinationResponse>>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                destinationService.search(q, page, size, getUserId(authentication))));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<DestinationResponse>>> getTrending() {
        return ResponseEntity.ok(ApiResponse.success(destinationService.getTrending()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DestinationResponse>> getById(
            @PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                destinationService.getById(id, getUserId(authentication))));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<Boolean>> toggleSave(
            @PathVariable Long id, Authentication authentication) {
        boolean saved = destinationService.toggleSave(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(saved ? "Destination saved" : "Destination unsaved", saved));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<DestinationResponse>>> getSaved(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                destinationService.getSavedDestinations(authentication.getName())));
    }

    private Long getUserId(Authentication authentication) {
        if (authentication == null) return null;
        return userRepository.findByEmail(authentication.getName()).map(User::getId).orElse(null);
    }
}
