package com.nammatrips.repository;

import com.nammatrips.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Trip> findByUserIdAndStatus(Long userId, Trip.TripStatus status);
    long countByUserId(Long userId);
    long countByStatus(Trip.TripStatus status);
}
