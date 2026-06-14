package com.nammatrips.service;

import com.nammatrips.dto.request.ProfileUpdateRequest;
import com.nammatrips.dto.response.UserResponse;
import com.nammatrips.entity.User;
import com.nammatrips.exception.ResourceNotFoundException;
import com.nammatrips.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TripService tripService;

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return AuthService.mapToUserResponse(user);
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return AuthService.mapToUserResponse(user);
    }

    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getAvatar() != null) user.setAvatar(request.getAvatar());

        user = userRepository.save(user);
        return AuthService.mapToUserResponse(user);
    }

    public Map<String, Object> getUserStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTrips", tripService.getUserTripCount(user.getId()));
        stats.put("xpPoints", user.getXpPoints());
        stats.put("travelLevel", user.getTravelLevel());
        stats.put("memberSince", user.getCreatedAt());
        return stats;
    }

    public void addXpPoints(Long userId, int points) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setXpPoints(user.getXpPoints() + points);
        user.setTravelLevel(calculateLevel(user.getXpPoints()));
        userRepository.save(user);
    }

    private String calculateLevel(int xp) {
        if (xp >= 5000) return "Legend";
        if (xp >= 3000) return "Voyager";
        if (xp >= 1500) return "Adventurer";
        if (xp >= 500) return "Wanderer";
        return "Explorer";
    }
}
