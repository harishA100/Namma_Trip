package com.nammatrips.service;

import com.nammatrips.dto.request.PartnerRequestDto;
import com.nammatrips.entity.PartnerMatch;
import com.nammatrips.entity.PartnerRequest;
import com.nammatrips.entity.User;
import com.nammatrips.exception.ResourceNotFoundException;
import com.nammatrips.repository.PartnerMatchRepository;
import com.nammatrips.repository.PartnerRequestRepository;
import com.nammatrips.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartnerService {

    private final PartnerRequestRepository requestRepository;
    private final PartnerMatchRepository matchRepository;
    private final UserRepository userRepository;

    public Map<String, Object> createRequest(PartnerRequestDto dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        PartnerRequest request = PartnerRequest.builder()
                .user(user)
                .destination(dto.getDestination())
                .travelDate(dto.getTravelDate())
                .interests(dto.getInterests())
                .travelStyle(dto.getTravelStyle())
                .status(PartnerRequest.RequestStatus.ACTIVE)
                .build();

        request = requestRepository.save(request);

        // Auto-match with existing requests
        List<PartnerRequest> matches = requestRepository
                .findByDestinationIgnoreCaseAndStatusAndUserIdNot(
                        dto.getDestination(), PartnerRequest.RequestStatus.ACTIVE, user.getId());

        for (PartnerRequest match : matches) {
            PartnerMatch pm = PartnerMatch.builder()
                    .request(request)
                    .matchedUser(match.getUser())
                    .status(PartnerMatch.MatchStatus.PENDING)
                    .build();
            matchRepository.save(pm);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("request", mapRequestToResponse(request));
        response.put("matchesFound", matches.size());
        return response;
    }

    public List<Map<String, Object>> getMatches(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        return matchRepository.findByMatchedUserIdOrRequestUserId(user.getId(), user.getId())
                .stream()
                .map(this::mapMatchToResponse)
                .collect(Collectors.toList());
    }

    private Map<String, Object> mapRequestToResponse(PartnerRequest req) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", req.getId());
        map.put("userId", req.getUser().getId());
        map.put("userName", req.getUser().getName());
        map.put("destination", req.getDestination());
        map.put("travelDate", req.getTravelDate());
        map.put("interests", req.getInterests());
        map.put("travelStyle", req.getTravelStyle());
        map.put("status", req.getStatus().name());
        return map;
    }

    private Map<String, Object> mapMatchToResponse(PartnerMatch match) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", match.getId());
        map.put("destination", match.getRequest().getDestination());
        map.put("matchedUser", Map.of(
                "id", match.getMatchedUser().getId(),
                "name", match.getMatchedUser().getName(),
                "avatar", match.getMatchedUser().getAvatar() != null ? match.getMatchedUser().getAvatar() : ""
        ));
        map.put("status", match.getStatus().name());
        map.put("createdAt", match.getCreatedAt());
        return map;
    }
}
