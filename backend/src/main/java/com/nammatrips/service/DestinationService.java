package com.nammatrips.service;

import com.nammatrips.dto.response.DestinationResponse;
import com.nammatrips.entity.Destination;
import com.nammatrips.entity.SavedDestination;
import com.nammatrips.entity.User;
import com.nammatrips.exception.ResourceNotFoundException;
import com.nammatrips.repository.DestinationRepository;
import com.nammatrips.repository.SavedDestinationRepository;
import com.nammatrips.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final SavedDestinationRepository savedRepository;
    private final UserRepository userRepository;

    public Page<DestinationResponse> getAllDestinations(int page, int size, Long userId) {
        return destinationRepository.findAll(PageRequest.of(page, size))
                .map(d -> mapToResponse(d, userId));
    }

    public Page<DestinationResponse> getByCategory(String category, int page, int size, Long userId) {
        return destinationRepository.findByCategoryIgnoreCase(category, PageRequest.of(page, size))
                .map(d -> mapToResponse(d, userId));
    }

    public Page<DestinationResponse> search(String query, int page, int size, Long userId) {
        return destinationRepository.searchByNameOrDescription(query, PageRequest.of(page, size))
                .map(d -> mapToResponse(d, userId));
    }

    public DestinationResponse getById(Long id, Long userId) {
        Destination dest = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination", "id", id));
        return mapToResponse(dest, userId);
    }

    public List<DestinationResponse> getTrending() {
        return destinationRepository.findTop10ByOrderByRatingDesc()
                .stream()
                .map(d -> mapToResponse(d, null))
                .collect(Collectors.toList());
    }

    public boolean toggleSave(Long destinationId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        Destination dest = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination", "id", destinationId));

        var existing = savedRepository.findByUserIdAndDestinationId(user.getId(), destinationId);
        if (existing.isPresent()) {
            savedRepository.delete(existing.get());
            return false;
        } else {
            savedRepository.save(SavedDestination.builder().user(user).destination(dest).build());
            return true;
        }
    }

    public List<DestinationResponse> getSavedDestinations(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return savedRepository.findByUserId(user.getId())
                .stream()
                .map(sd -> mapToResponse(sd.getDestination(), user.getId()))
                .collect(Collectors.toList());
    }

    // Admin methods
    public DestinationResponse createDestination(Destination destination) {
        destination = destinationRepository.save(destination);
        return mapToResponse(destination, null);
    }

    public DestinationResponse updateDestination(Long id, Destination updates) {
        Destination dest = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination", "id", id));

        if (updates.getName() != null) dest.setName(updates.getName());
        if (updates.getCategory() != null) dest.setCategory(updates.getCategory());
        if (updates.getDescription() != null) dest.setDescription(updates.getDescription());
        if (updates.getBestSeason() != null) dest.setBestSeason(updates.getBestSeason());
        if (updates.getRating() != null) dest.setRating(updates.getRating());
        if (updates.getImages() != null) dest.setImages(updates.getImages());

        dest = destinationRepository.save(dest);
        return mapToResponse(dest, null);
    }

    public void deleteDestination(Long id) {
        if (!destinationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Destination", "id", id);
        }
        destinationRepository.deleteById(id);
    }

    private DestinationResponse mapToResponse(Destination dest, Long userId) {
        boolean saved = userId != null && savedRepository.existsByUserIdAndDestinationId(userId, dest.getId());
        return DestinationResponse.builder()
                .id(dest.getId())
                .name(dest.getName())
                .category(dest.getCategory())
                .description(dest.getDescription())
                .bestSeason(dest.getBestSeason())
                .rating(dest.getRating())
                .images(dest.getImages())
                .latitude(dest.getLatitude())
                .longitude(dest.getLongitude())
                .savedByCurrentUser(saved)
                .build();
    }
}
