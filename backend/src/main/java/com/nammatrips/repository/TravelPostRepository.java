package com.nammatrips.repository;

import com.nammatrips.entity.TravelPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelPostRepository extends JpaRepository<TravelPost, Long> {
    Page<TravelPost> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<TravelPost> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    long countByUserId(Long userId);
}
