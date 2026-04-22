package com.rpgbank.service;

import com.rpgbank.entity.Account;
import com.rpgbank.entity.Tier;
import com.rpgbank.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterestTask {

    private final AccountRepository accountRepository;
    private final BankService bankService;
    private final TransactionService transactionService;
    private final TierService tierService;

    @Scheduled(fixedRate = 10000) // 10 seconds
    public void applyInterestToAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        
        try {
            for (Account account : accounts) {
                // Get user's tier to calculate interest rate
                Tier userTier = tierService.getUserTier(account.getBalance());
                
                // Calculate base interest (1%) + tier bonus
                BigDecimal baseRate = BigDecimal.valueOf(0.01); // 1%
                BigDecimal tierBonus = BigDecimal.valueOf(userTier.getInterestBonus() / 100); // Convert percentage to decimal
                BigDecimal totalRate = baseRate.add(tierBonus);
                
                BigDecimal interest = account.getBalance().multiply(totalRate);
                bankService.deposit(account.getId(), interest.doubleValue());
                
                // Record interest transaction
                transactionService.recordInterest(account, interest);
                
                // Check for achievements after interest payment
                tierService.checkAndAwardAchievements(account.getUser());
            }
            
            log.info("Interest applied successfully with tier bonuses");
        } catch (Exception e) {
            log.error("Error applying interest: {}", e.getMessage());
        }
    }
}
