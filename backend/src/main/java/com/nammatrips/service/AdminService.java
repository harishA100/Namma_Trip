package com.nammatrips.service;

import com.nammatrips.entity.User;
import com.nammatrips.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final DestinationRepository destinationRepository;
    private final TravelPostRepository postRepository;

    public Page<Map<String, Object>> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size))
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("name", user.getName());
                    map.put("email", user.getEmail());
                    map.put("role", user.getRole().name());
                    map.put("xpPoints", user.getXpPoints());
                    map.put("travelLevel", user.getTravelLevel());
                    map.put("createdAt", user.getCreatedAt());
                    return map;
                });
    }

    public void updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.nammatrips.exception.ResourceNotFoundException("User", "id", userId));
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalTrips", tripRepository.count());
        analytics.put("totalDestinations", destinationRepository.count());
        analytics.put("totalPosts", postRepository.count());
        analytics.put("activeTrips", tripRepository.countByStatus(com.nammatrips.entity.Trip.TripStatus.ACTIVE));
        analytics.put("totalAdmins", userRepository.countByRole(User.Role.ADMIN));
        analytics.put("totalTravelers", userRepository.countByRole(User.Role.TRAVELER));
        return analytics;
    }
}
