package com.rpgbank.dto;

import lombok.Data;

@Data
public class UserTierInfo {
    private String tierName;
    private String tierTitle;
    private String tierColor;
    private String tierIcon;
    private java.math.BigDecimal currentBalance;
    private java.math.BigDecimal nextTierBalance;
    private String nextTierName;
    private java.math.BigDecimal progressPercentage;
    private Integer achievementCount;
    
    public UserTierInfo(String tierName, String tierTitle, String tierColor, String tierIcon,
                       java.math.BigDecimal currentBalance, java.math.BigDecimal nextTierBalance,
                       String nextTierName, java.math.BigDecimal progressPercentage,
                       Integer achievementCount) {
        this.tierName = tierName;
        this.tierTitle = tierTitle;
        this.tierColor = tierColor;
        this.tierIcon = tierIcon;
        this.currentBalance = currentBalance;
        this.nextTierBalance = nextTierBalance;
        this.nextTierName = nextTierName;
        this.progressPercentage = progressPercentage;
        this.achievementCount = achievementCount;
    }
}
