package com.nammatrips.repository;

import com.nammatrips.entity.PartnerMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnerMatchRepository extends JpaRepository<PartnerMatch, Long> {
    List<PartnerMatch> findByMatchedUserIdOrRequestUserId(Long matchedUserId, Long requestUserId);
}
