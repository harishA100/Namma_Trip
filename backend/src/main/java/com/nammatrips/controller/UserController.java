package com.nammatrips.controller;

import com.nammatrips.dto.request.ProfileUpdateRequest;
import com.nammatrips.dto.response.ApiResponse;
import com.nammatrips.dto.response.UserResponse;
import com.nammatrips.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication authentication,
            @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                userService.updateProfile(authentication.getName(), request)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserStats(authentication.getName())));
    }
}
