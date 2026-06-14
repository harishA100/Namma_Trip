package com.nammatrips.repository;

import com.nammatrips.entity.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    Page<Destination> findByCategoryIgnoreCase(String category, Pageable pageable);

    @Query("SELECT d FROM Destination d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Destination> searchByNameOrDescription(String query, Pageable pageable);

    List<Destination> findTop10ByOrderByRatingDesc();
    long countByCategory(String category);
}
