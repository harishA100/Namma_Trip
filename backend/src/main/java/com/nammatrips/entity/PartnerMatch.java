package com.nammatrips.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "partner_matches")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private PartnerRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matched_user_id", nullable = false)
    private User matchedUser;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private MatchStatus status = MatchStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum MatchStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
