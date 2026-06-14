package com.nammatrips.controller;

import com.nammatrips.dto.response.ApiResponse;
import com.nammatrips.entity.Destination;
import com.nammatrips.service.AdminService;
import com.nammatrips.service.DestinationService;
import com.nammatrips.service.TravelPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final DestinationService destinationService;
    private final TravelPostService postService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<Map<String, Object>>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers(page, size)));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<String>> updateRole(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        adminService.updateUserRole(id, body.get("role"));
        return ResponseEntity.ok(ApiResponse.success("Role updated", null));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    @PostMapping("/destinations")
    public ResponseEntity<ApiResponse<Object>> addDestination(@RequestBody Destination destination) {
        return ResponseEntity.ok(ApiResponse.success("Destination added",
                destinationService.createDestination(destination)));
    }

    @PutMapping("/destinations/{id}")
    public ResponseEntity<ApiResponse<Object>> updateDestination(
            @PathVariable Long id, @RequestBody Destination destination) {
        return ResponseEntity.ok(ApiResponse.success(destinationService.updateDestination(id, destination)));
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.ok(ApiResponse.success("Destination deleted", null));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<String>> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success("Post deleted", null));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAnalytics()));
    }
}
