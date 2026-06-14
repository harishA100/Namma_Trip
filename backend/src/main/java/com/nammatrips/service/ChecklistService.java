package com.nammatrips.service;

import com.nammatrips.entity.ChecklistItem;
import com.nammatrips.entity.Trip;
import com.nammatrips.exception.ResourceNotFoundException;
import com.nammatrips.repository.ChecklistItemRepository;
import com.nammatrips.repository.TripRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChecklistService {

    private final ChecklistItemRepository checklistRepository;
    private final TripRepository tripRepository;
    private final GeminiService geminiService;

    public List<Map<String, Object>> getChecklist(Long tripId) {
        return checklistRepository.findByTripId(tripId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> generateChecklist(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        String checklistJson = geminiService.generateChecklist(
                trip.getDestination(), trip.getDuration(),
                trip.getInterests() != null ? trip.getInterests() : "General"
        );

        List<String> items = parseChecklistItems(checklistJson);

        List<ChecklistItem> savedItems = new ArrayList<>();
        for (String item : items) {
            ChecklistItem ci = ChecklistItem.builder()
                    .trip(trip)
                    .item(item)
                    .completed(false)
                    .build();
            savedItems.add(checklistRepository.save(ci));
        }

        return savedItems.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public Map<String, Object> toggleItem(Long id) {
        ChecklistItem item = checklistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ChecklistItem", "id", id));
        item.setCompleted(!item.getCompleted());
        item = checklistRepository.save(item);
        return mapToResponse(item);
    }

    private List<String> parseChecklistItems(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            // Try to extract JSON array from the response
            String cleaned = json.trim();
            if (cleaned.contains("[")) {
                cleaned = cleaned.substring(cleaned.indexOf("["), cleaned.lastIndexOf("]") + 1);
            }
            return mapper.readValue(cleaned, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse checklist JSON, using defaults", e);
            return List.of(
                "ID Proof / Passport", "Comfortable walking shoes", "Sunscreen SPF 50+",
                "Water bottle", "Power bank", "First aid kit", "Camera",
                "Light cotton clothing", "Rain jacket", "Snacks",
                "Travel adapter", "Toiletries", "Medications",
                "Cash and cards", "Temple-appropriate clothing"
            );
        }
    }

    private Map<String, Object> mapToResponse(ChecklistItem item) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", item.getId());
        map.put("tripId", item.getTrip().getId());
        map.put("item", item.getItem());
        map.put("completed", item.getCompleted());
        return map;
    }
}
