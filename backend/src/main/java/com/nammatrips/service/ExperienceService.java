package com.nammatrips.service;

import com.nammatrips.dto.request.ExperienceRequest;
import com.nammatrips.entity.Experience;
import com.nammatrips.entity.User;
import com.nammatrips.exception.ResourceNotFoundException;
import com.nammatrips.repository.ExperienceRepository;
import com.nammatrips.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final UserRepository userRepository;

    public Page<Map<String, Object>> getAllExperiences(int page, int size) {
        return experienceRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    public Map<String, Object> createExperience(ExperienceRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        Experience experience = Experience.builder()
                .user(user)
                .destination(request.getDestination())
                .title(request.getTitle())
                .description(request.getDescription())
                .rating(request.getRating())
                .images(request.getImages())
                .build();

        experience = experienceRepository.save(experience);
        return mapToResponse(experience);
    }

    public Map<String, Object> updateExperience(Long id, ExperienceRequest request) {
        Experience exp = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));

        if (request.getTitle() != null) exp.setTitle(request.getTitle());
        if (request.getDescription() != null) exp.setDescription(request.getDescription());
        if (request.getDestination() != null) exp.setDestination(request.getDestination());
        if (request.getRating() != null) exp.setRating(request.getRating());
        if (request.getImages() != null) exp.setImages(request.getImages());

        exp = experienceRepository.save(exp);
        return mapToResponse(exp);
    }

    public void deleteExperience(Long id) {
        if (!experienceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Experience", "id", id);
        }
        experienceRepository.deleteById(id);
    }

    private Map<String, Object> mapToResponse(Experience exp) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", exp.getId());
        map.put("userId", exp.getUser().getId());
        map.put("userName", exp.getUser().getName());
        map.put("userAvatar", exp.getUser().getAvatar());
        map.put("destination", exp.getDestination());
        map.put("title", exp.getTitle());
        map.put("description", exp.getDescription());
        map.put("rating", exp.getRating());
        map.put("images", exp.getImages());
        map.put("createdAt", exp.getCreatedAt());
        return map;
    }
}
