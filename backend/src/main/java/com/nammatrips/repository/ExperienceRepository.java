package com.nammatrips.repository;

import com.nammatrips.entity.Experience;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    Page<Experience> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Experience> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
