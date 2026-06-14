package com.nammatrips.service;

import com.nammatrips.dto.request.PostCreateRequest;
import com.nammatrips.dto.response.PostResponse;
import com.nammatrips.entity.*;
import com.nammatrips.exception.ResourceNotFoundException;
import com.nammatrips.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TravelPostService {

    private final TravelPostRepository postRepository;
    private final PostLikeRepository likeRepository;
    private final PostCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    public Page<PostResponse> getFeed(int page, int size, Long currentUserId) {
        Page<TravelPost> posts = postRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return posts.map(post -> mapToPostResponse(post, currentUserId));
    }

    public PostResponse createPost(PostCreateRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        TravelPost post = TravelPost.builder()
                .user(user)
                .caption(request.getCaption())
                .images(request.getImages())
                .likeCount(0)
                .build();

        if (request.getDestinationId() != null) {
            Destination dest = destinationRepository.findById(request.getDestinationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Destination", "id", request.getDestinationId()));
            post.setDestination(dest);
        }

        post = postRepository.save(post);
        return mapToPostResponse(post, user.getId());
    }

    @Transactional
    public PostResponse toggleLike(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        TravelPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        var existingLike = likeRepository.findByPostIdAndUserId(postId, user.getId());

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        } else {
            PostLike like = PostLike.builder().post(post).user(user).build();
            likeRepository.save(like);
            post.setLikeCount(post.getLikeCount() + 1);
        }

        postRepository.save(post);
        return mapToPostResponse(post, user.getId());
    }

    public PostResponse addComment(Long postId, String content, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        TravelPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        PostComment comment = PostComment.builder()
                .post(post)
                .user(user)
                .content(content)
                .build();

        commentRepository.save(comment);
        return mapToPostResponse(post, user.getId());
    }

    public List<Object> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
                .stream()
                .map(c -> {
                    var map = new java.util.HashMap<String, Object>();
                    map.put("id", c.getId());
                    map.put("content", c.getContent());
                    map.put("userName", c.getUser().getName());
                    map.put("userAvatar", c.getUser().getAvatar());
                    map.put("createdAt", c.getCreatedAt());
                    return (Object) map;
                })
                .collect(Collectors.toList());
    }

    public void deletePost(Long postId) {
        TravelPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
        postRepository.delete(post);
    }

    private PostResponse mapToPostResponse(TravelPost post, Long currentUserId) {
        boolean liked = currentUserId != null && likeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);
        long commentCount = commentRepository.countByPostId(post.getId());

        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUser().getId())
                .userName(post.getUser().getName())
                .userAvatar(post.getUser().getAvatar())
                .destinationId(post.getDestination() != null ? post.getDestination().getId() : null)
                .destinationName(post.getDestination() != null ? post.getDestination().getName() : null)
                .images(post.getImages())
                .caption(post.getCaption())
                .likeCount(post.getLikeCount())
                .likedByCurrentUser(liked)
                .commentCount((int) commentCount)
                .createdAt(post.getCreatedAt())
                .build();
    }
}
