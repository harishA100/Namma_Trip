package com.nammatrips.repository;

import com.nammatrips.entity.SavedDestination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedDestinationRepository extends JpaRepository<SavedDestination, Long> {
    List<SavedDestination> findByUserId(Long userId);
    Optional<SavedDestination> findByUserIdAndDestinationId(Long userId, Long destinationId);
    boolean existsByUserIdAndDestinationId(Long userId, Long destinationId);
}
