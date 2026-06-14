package com.nammatrips.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    private final WebClient geminiWebClient;

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model}")
    private String model;

    public String generateItinerary(String destination, int budget, int duration, String companions, String interests) {
        String prompt = buildItineraryPrompt(destination, budget, duration, companions, interests);

        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            String response = geminiWebClient
                .post()
                .uri("/models/{model}:generateContent?key={key}", model, apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            return extractTextFromResponse(response);
        } catch (Exception e) {
            log.error("Failed to generate itinerary from Gemini API", e);
            return generateFallbackItinerary(destination, budget, duration);
        }
    }

    public String generateChecklist(String destination, int duration, String travelType) {
        String prompt = String.format(
            "Generate a smart travel checklist for a %d-day trip to %s, Tamil Nadu. " +
            "Travel type: %s. Format as a JSON array of strings. Include essentials, " +
            "destination-specific items, weather-appropriate clothing, and documents. " +
            "Return ONLY the JSON array, no other text.",
            duration, destination, travelType
        );

        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of("parts", List.of(
                        Map.of("text", prompt)
                    ))
                )
            );

            String response = geminiWebClient
                .post()
                .uri("/models/{model}:generateContent?key={key}", model, apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

            return extractTextFromResponse(response);
        } catch (Exception e) {
            log.error("Failed to generate checklist from Gemini API", e);
            return generateFallbackChecklist();
        }
    }

    private String buildItineraryPrompt(String destination, int budget, int duration, String companions, String interests) {
        return String.format(
            "Create a detailed %d-day travel itinerary for %s in Tamil Nadu, India.\n" +
            "Budget: ₹%d\n" +
            "Travel Companions: %s\n" +
            "Interests: %s\n\n" +
            "Please provide the itinerary in the following JSON format:\n" +
            "{\n" +
            "  \"title\": \"Trip title\",\n" +
            "  \"summary\": \"Brief summary\",\n" +
            "  \"days\": [\n" +
            "    {\n" +
            "      \"day\": 1,\n" +
            "      \"title\": \"Day title\",\n" +
            "      \"activities\": [\n" +
            "        {\n" +
            "          \"time\": \"9:00 AM\",\n" +
            "          \"activity\": \"Activity name\",\n" +
            "          \"description\": \"Description\",\n" +
            "          \"estimatedCost\": 500,\n" +
            "          \"location\": \"Place name\"\n" +
            "        }\n" +
            "      ],\n" +
            "      \"meals\": [\n" +
            "        {\n" +
            "          \"type\": \"Breakfast\",\n" +
            "          \"suggestion\": \"Restaurant or food\",\n" +
            "          \"estimatedCost\": 200\n" +
            "        }\n" +
            "      ],\n" +
            "      \"accommodation\": {\n" +
            "        \"name\": \"Hotel name\",\n" +
            "        \"estimatedCost\": 1500\n" +
            "      }\n" +
            "    }\n" +
            "  ],\n" +
            "  \"tips\": [\"tip1\", \"tip2\"],\n" +
            "  \"totalEstimatedCost\": 5000\n" +
            "}\n\n" +
            "Return ONLY the JSON, no other text. Include authentic Tamil Nadu experiences, " +
            "local food recommendations, and cultural tips. Stay within the budget.",
            duration, destination, budget,
            companions != null ? companions : "Solo",
            interests != null ? interests : "General sightseeing"
        );
    }

    private String extractTextFromResponse(String response) {
        if (response == null) return generateFallbackItinerary("Unknown", 5000, 3);

        try {
            // Parse the Gemini API response to extract text
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            var node = mapper.readTree(response);
            var candidates = node.get("candidates");
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                var content = candidates.get(0).get("content");
                if (content != null) {
                    var parts = content.get("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        return parts.get(0).get("text").asText();
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse Gemini response", e);
        }

        return response;
    }

    private String generateFallbackItinerary(String destination, int budget, int duration) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append("  \"title\": \"").append(duration).append("-Day ").append(destination).append(" Adventure\",\n");
        sb.append("  \"summary\": \"Explore the beautiful ").append(destination).append(" in Tamil Nadu\",\n");
        sb.append("  \"days\": [\n");

        for (int i = 1; i <= duration; i++) {
            sb.append("    {\n");
            sb.append("      \"day\": ").append(i).append(",\n");
            sb.append("      \"title\": \"Day ").append(i).append(" - Exploring ").append(destination).append("\",\n");
            sb.append("      \"activities\": [\n");
            sb.append("        {\n");
            sb.append("          \"time\": \"9:00 AM\",\n");
            sb.append("          \"activity\": \"Morning sightseeing\",\n");
            sb.append("          \"description\": \"Visit the top attractions of ").append(destination).append("\",\n");
            sb.append("          \"estimatedCost\": ").append(budget / duration / 4).append(",\n");
            sb.append("          \"location\": \"").append(destination).append(" Main Area\"\n");
            sb.append("        },\n");
            sb.append("        {\n");
            sb.append("          \"time\": \"2:00 PM\",\n");
            sb.append("          \"activity\": \"Afternoon exploration\",\n");
            sb.append("          \"description\": \"Discover hidden gems and local culture\",\n");
            sb.append("          \"estimatedCost\": ").append(budget / duration / 4).append(",\n");
            sb.append("          \"location\": \"").append(destination).append(" Cultural Area\"\n");
            sb.append("        }\n");
            sb.append("      ],\n");
            sb.append("      \"meals\": [\n");
            sb.append("        {\"type\": \"Breakfast\", \"suggestion\": \"Local idli-dosa\", \"estimatedCost\": 150},\n");
            sb.append("        {\"type\": \"Lunch\", \"suggestion\": \"Tamil meals\", \"estimatedCost\": 300},\n");
            sb.append("        {\"type\": \"Dinner\", \"suggestion\": \"Local specialties\", \"estimatedCost\": 400}\n");
            sb.append("      ],\n");
            sb.append("      \"accommodation\": {\"name\": \"Comfortable Hotel\", \"estimatedCost\": ").append(budget / duration / 3).append("}\n");
            sb.append("    }");
            if (i < duration) sb.append(",");
            sb.append("\n");
        }

        sb.append("  ],\n");
        sb.append("  \"tips\": [\"Carry sunscreen and water\", \"Try local filter coffee\", \"Respect temple dress codes\"],\n");
        sb.append("  \"totalEstimatedCost\": ").append(budget).append("\n");
        sb.append("}");

        return sb.toString();
    }

    private String generateFallbackChecklist() {
        return "[\"ID Proof / Passport\", \"Comfortable walking shoes\", \"Sunscreen SPF 50+\", " +
               "\"Water bottle\", \"Power bank\", \"First aid kit\", \"Camera\", " +
               "\"Light cotton clothing\", \"Rain jacket\", \"Snacks\", " +
               "\"Travel adapter\", \"Toiletries\", \"Medications\", " +
               "\"Cash and cards\", \"Temple-appropriate clothing\"]";
    }
}
