package com.nammatrips.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "partner_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String destination;

    private LocalDate travelDate;

    @Column(columnDefinition = "TEXT")
    private String interests;

    private String travelStyle;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.ACTIVE;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum RequestStatus {
        ACTIVE, MATCHED, EXPIRED
    }
}
