package com.nammatrips.repository;

import com.nammatrips.entity.PartnerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnerRequestRepository extends JpaRepository<PartnerRequest, Long> {
    List<PartnerRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<PartnerRequest> findByDestinationIgnoreCaseAndStatusAndUserIdNot(
            String destination, PartnerRequest.RequestStatus status, Long userId);
}
