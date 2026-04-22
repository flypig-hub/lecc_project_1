package com.rpgbank.service;

import com.rpgbank.dto.AdminStatsDto;
import com.rpgbank.dto.TransactionChartDto;
import com.rpgbank.entity.Transaction;
import com.rpgbank.entity.User;
import com.rpgbank.repository.TransactionRepository;
import com.rpgbank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public AdminStatsDto getSystemStats() {
        log.info("Fetching system statistics for admin dashboard");
        
        long totalUsers = userRepository.count();
        long totalAccounts = userRepository.findAll().stream()
                .mapToLong(user -> user.getAccounts().size())
                .sum();
        BigDecimal totalBalance = userRepository.findAll().stream()
                .flatMap(user -> user.getAccounts().stream())
                .map(account -> account.getBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        long todayTransactions = transactionRepository.countByTransactionDateAfter(today);
        
        // Active users = users who had transactions in last 7 days
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        long activeUsers = userRepository.findAll().stream()
                .filter(user -> user.getAccounts().stream()
                        .anyMatch(account -> account.getTransactions().stream()
                                .anyMatch(tx -> tx.getTransactionDate().isAfter(weekAgo))))
                .count();

        return new AdminStatsDto(
                totalUsers,
                totalAccounts,
                totalBalance,
                todayTransactions,
                activeUsers,
                LocalDate.now()
        );
    }

    public List<TransactionChartDto> getTransactionChartData() {
        log.info("Fetching 7-day transaction chart data");
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6); // Last 7 days including today

        return transactionRepository.findTransactionsByDateRange(startDate, endDate)
                .stream()
                .collect(Collectors.groupingBy(
                        tx -> tx.getTransactionDate().toLocalDate(),
                        Collectors.collectingAndThen(
                                Collectors.summarizingLong(tx -> 1L),
                                summary -> summary.getCount()
                        )
                ))
                .entrySet().stream()
                .map(entry -> new TransactionChartDto(
                        entry.getKey(),
                        entry.getValue(),
                        transactionRepository.findTotalAmountByDate(entry.getKey())
                ))
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());
    }
}
