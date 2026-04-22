package com.rpgbank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class AdminStatsDto {
    private long totalUsers;
    private long totalAccounts;
    private BigDecimal totalBalance;
    private long todayTransactions;
    private long activeUsers;
    private LocalDate date;
}
