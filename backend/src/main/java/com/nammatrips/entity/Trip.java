package com.nammatrips.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String destination;

    private Integer duration;

    private BigDecimal budget;

    @Column(columnDefinition = "TEXT")
    private String itinerary;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.PLANNED;

    private String companions;

    private String interests;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum TripStatus {
        PLANNED, ACTIVE, COMPLETED, CANCELLED
    }
}
