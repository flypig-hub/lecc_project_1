package com.rpgbank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class TransactionChartDto {
    private LocalDate date;
    private long transactionCount;
    private BigDecimal totalAmount;
}
