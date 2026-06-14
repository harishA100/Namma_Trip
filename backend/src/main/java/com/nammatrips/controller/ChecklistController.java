package com.nammatrips.controller;

import com.nammatrips.dto.response.ApiResponse;
import com.nammatrips.service.ChecklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/checklists")
@RequiredArgsConstructor
public class ChecklistController {

    private final ChecklistService checklistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getChecklist(@RequestParam Long tripId) {
        return ResponseEntity.ok(ApiResponse.success(checklistService.getChecklist(tripId)));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> generateChecklist(
            @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(ApiResponse.success("Checklist generated",
                checklistService.generateChecklist(body.get("tripId"))));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleItem(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(checklistService.toggleItem(id)));
    }
}
