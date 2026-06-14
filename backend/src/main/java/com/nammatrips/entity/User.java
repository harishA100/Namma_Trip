package com.nammatrips.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatar;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Builder.Default
    private Integer xpPoints = 0;

    @Builder.Default
    private String travelLevel = "Explorer";

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private Role role = Role.TRAVELER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Role {
        TRAVELER, ADMIN
    }
}
