package com.rpgbank.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "achievements")
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private String condition; // Condition description (e.g., "FIRST_TRANSFER", "BALANCE_100K")
    
    @Column(name = "condition_value")
    private java.math.BigDecimal conditionValue; // Numeric value for condition
    
    @Column(name = "achievement_icon")
    private String achievementIcon; // Icon or emoji
    
    @Column(name = "achievement_points")
    private Integer achievementPoints; // Points for ranking
    
    @Column(name = "is_hidden")
    private Boolean isHidden; // Whether achievement is hidden until unlocked
}
