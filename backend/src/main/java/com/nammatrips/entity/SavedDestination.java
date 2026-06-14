package com.nammatrips.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_destinations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "destination_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedDestination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
