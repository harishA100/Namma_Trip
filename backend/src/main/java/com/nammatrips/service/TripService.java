package com.nammatrips.service;

import com.nammatrips.dto.request.TripGenerateRequest;
import com.nammatrips.dto.response.TripResponse;
import com.nammatrips.entity.Journey;
import com.nammatrips.entity.Trip;
import com.nammatrips.entity.User;
import com.nammatrips.exception.ResourceNotFoundException;
import com.nammatrips.repository.JourneyRepository;
import com.nammatrips.repository.TripRepository;
import com.nammatrips.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final JourneyRepository journeyRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    @Transactional
    public TripResponse generateTrip(TripGenerateRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        // Generate itinerary using Gemini AI
        String itinerary = geminiService.generateItinerary(
                request.getDestination(),
                request.getBudget().intValue(),
                request.getDuration(),
                request.getCompanions(),
                request.getInterests()
        );

        Trip trip = Trip.builder()
                .user(user)
                .destination(request.getDestination())
                .duration(request.getDuration())
                .budget(request.getBudget())
                .itinerary(itinerary)
                .companions(request.getCompanions())
                .interests(request.getInterests())
                .status(Trip.TripStatus.PLANNED)
                .build();

        trip = tripRepository.save(trip);

        // Create journey for gamification
        Journey journey = Journey.builder()
                .trip(trip)
                .currentCheckpoint(0)
                .progress(0.0)
                .xpEarned(0)
                .build();
        journeyRepository.save(journey);

        return mapToTripResponse(trip);
    }

    public List<TripResponse> getUserTrips(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return tripRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToTripResponse)
                .collect(Collectors.toList());
    }

    public TripResponse getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", id));
        return mapToTripResponse(trip);
    }

    public TripResponse updateTripStatus(Long id, String status) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", id));
        trip.setStatus(Trip.TripStatus.valueOf(status.toUpperCase()));
        trip = tripRepository.save(trip);
        return mapToTripResponse(trip);
    }

    public long getUserTripCount(Long userId) {
        return tripRepository.countByUserId(userId);
    }

    private TripResponse mapToTripResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .userId(trip.getUser().getId())
                .userName(trip.getUser().getName())
                .destination(trip.getDestination())
                .duration(trip.getDuration())
                .budget(trip.getBudget())
                .itinerary(trip.getItinerary())
                .status(trip.getStatus().name())
                .companions(trip.getCompanions())
                .interests(trip.getInterests())
                .createdAt(trip.getCreatedAt())
                .build();
    }
}
