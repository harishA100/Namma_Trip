package com.nammatrips.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "journeys")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Journey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false, unique = true)
    private Trip trip;

    @Builder.Default
    private Integer currentCheckpoint = 0;

    @Builder.Default
    private Double progress = 0.0;

    @Builder.Default
    private Integer xpEarned = 0;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
