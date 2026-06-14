package com.nammatrips.controller;

import com.nammatrips.dto.request.ExpenseRequest;
import com.nammatrips.dto.response.ApiResponse;
import com.nammatrips.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getExpenses(@RequestParam Long tripId) {
        return ResponseEntity.ok(ApiResponse.success(expenseService.getExpensesByTrip(tripId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> addExpense(@Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Expense added", expenseService.addExpense(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateExpense(
            @PathVariable Long id, @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(ApiResponse.success(expenseService.updateExpense(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted", null));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBudgetSummary(@RequestParam Long tripId) {
        return ResponseEntity.ok(ApiResponse.success(expenseService.getBudgetSummary(tripId)));
    }
}
