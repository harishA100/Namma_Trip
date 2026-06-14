package com.nammatrips.service;

import com.nammatrips.dto.request.ExpenseRequest;
import com.nammatrips.entity.Expense;
import com.nammatrips.entity.Trip;
import com.nammatrips.exception.ResourceNotFoundException;
import com.nammatrips.repository.ExpenseRepository;
import com.nammatrips.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final TripRepository tripRepository;

    public List<Map<String, Object>> getExpensesByTrip(Long tripId) {
        return expenseRepository.findByTripIdOrderByExpenseDateDesc(tripId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> addExpense(ExpenseRequest request) {
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", request.getTripId()));

        Expense expense = Expense.builder()
                .trip(trip)
                .category(Expense.ExpenseCategory.valueOf(request.getCategory().toUpperCase()))
                .amount(request.getAmount())
                .description(request.getDescription())
                .expenseDate(request.getExpenseDate() != null ? request.getExpenseDate() : LocalDate.now())
                .build();

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    public Map<String, Object> updateExpense(Long id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));

        if (request.getCategory() != null) {
            expense.setCategory(Expense.ExpenseCategory.valueOf(request.getCategory().toUpperCase()));
        }
        if (request.getAmount() != null) expense.setAmount(request.getAmount());
        if (request.getDescription() != null) expense.setDescription(request.getDescription());
        if (request.getExpenseDate() != null) expense.setExpenseDate(request.getExpenseDate());

        expense = expenseRepository.save(expense);
        return mapToResponse(expense);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense", "id", id);
        }
        expenseRepository.deleteById(id);
    }

    public Map<String, Object> getBudgetSummary(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", "id", tripId));

        BigDecimal totalSpent = expenseRepository.sumByTripId(tripId);
        List<Object[]> categoryTotals = expenseRepository.sumByCategoryAndTripId(tripId);

        Map<String, BigDecimal> categoryBreakdown = new HashMap<>();
        for (Object[] row : categoryTotals) {
            categoryBreakdown.put(row[0].toString(), (BigDecimal) row[1]);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("budget", trip.getBudget());
        summary.put("totalSpent", totalSpent);
        summary.put("remaining", trip.getBudget().subtract(totalSpent));
        summary.put("categoryBreakdown", categoryBreakdown);
        summary.put("percentUsed", trip.getBudget().compareTo(BigDecimal.ZERO) > 0
                ? totalSpent.multiply(BigDecimal.valueOf(100)).divide(trip.getBudget(), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO);

        return summary;
    }

    private Map<String, Object> mapToResponse(Expense expense) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", expense.getId());
        map.put("tripId", expense.getTrip().getId());
        map.put("category", expense.getCategory().name());
        map.put("amount", expense.getAmount());
        map.put("description", expense.getDescription());
        map.put("expenseDate", expense.getExpenseDate());
        return map;
    }
}
