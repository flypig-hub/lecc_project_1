package com.rpgbank.dto;

import lombok.Data;

@Data
public class LeaderboardEntry {
    private String username;
    private String tierName;
    private String tierTitle;
    private String tierColor;
    private String tierIcon;
    private java.math.BigDecimal totalBalance;
    private Integer rank;
    
    public LeaderboardEntry(String username, String tierName, String tierTitle, 
                           String tierColor, String tierIcon, 
                           java.math.BigDecimal totalBalance, Integer rank) {
        this.username = username;
        this.tierName = tierName;
        this.tierTitle = tierTitle;
        this.tierColor = tierColor;
        this.tierIcon = tierIcon;
        this.totalBalance = totalBalance;
        this.rank = rank;
    }
}
