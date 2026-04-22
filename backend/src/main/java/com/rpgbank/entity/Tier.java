package com.rpgbank.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tiers")
public class Tier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(name = "min_balance", nullable = false)
    private java.math.BigDecimal minBalance;
    
    @Column(name = "interest_bonus", nullable = false)
    private Double interestBonus; // Additional interest rate (e.g., 0.1 for +0.1%)
    
    @Column(name = "tier_color")
    private String tierColor; // CSS color for tier
    
    @Column(name = "tier_icon")
    private String tierIcon; // Icon or emoji for tier
    
    @Column(name = "tier_title")
    private String tierTitle; // Title for users (e.g., "Bronze Adventurer")
}
