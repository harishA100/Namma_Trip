package com.nammatrips.controller;

import com.nammatrips.dto.request.PostCreateRequest;
import com.nammatrips.dto.response.ApiResponse;
import com.nammatrips.dto.response.PostResponse;
import com.nammatrips.entity.User;
import com.nammatrips.exception.ResourceNotFoundException;
import com.nammatrips.repository.UserRepository;
import com.nammatrips.service.TravelPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class TravelPostController {

    private final TravelPostService postService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Long userId = null;
        if (authentication != null) {
            User user = userRepository.findByEmail(authentication.getName()).orElse(null);
            if (user != null) userId = user.getId();
        }
        return ResponseEntity.ok(ApiResponse.success(postService.getFeed(page, size, userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @Valid @RequestBody PostCreateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Post created", postService.createPost(request, authentication.getName())));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<PostResponse>> toggleLike(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(postService.toggleLike(id, authentication.getName())));
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<ApiResponse<PostResponse>> addComment(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                postService.addComment(id, body.get("content"), authentication.getName())));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<Object>>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(postService.getComments(id)));
    }
}
