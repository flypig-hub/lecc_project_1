package com.rpgbank.service;

import com.rpgbank.dto.UserTierInfo;
import com.rpgbank.dto.LeaderboardEntry;
import com.rpgbank.entity.*;
import com.rpgbank.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TierService {

    private final TierRepository tierRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    @Transactional(readOnly = true)
    public Tier getUserTier(BigDecimal balance) {
        return tierRepository.findTierByBalance(balance)
                .orElseGet(() -> tierRepository.findByOrderByMinBalanceAsc().get(0));
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "user-tiers", key = "#user.id")
    public UserTierInfo getUserTierInfo(User user) {
        BigDecimal totalBalance = getTotalBalance(user);
        Tier currentTier = getUserTier(totalBalance);
        
        // Find next tier
        List<Tier> allTiers = tierRepository.findByOrderByMinBalanceAsc();
        Tier nextTier = null;
        BigDecimal nextTierBalance = null;
        BigDecimal progressPercentage = BigDecimal.valueOf(100);
        
        for (int i = 0; i < allTiers.size() - 1; i++) {
            if (allTiers.get(i).getId().equals(currentTier.getId())) {
                nextTier = allTiers.get(i + 1);
                nextTierBalance = nextTier.getMinBalance();
                
                // Calculate progress percentage
                BigDecimal currentMin = currentTier.getMinBalance();
                BigDecimal range = nextTierBalance.subtract(currentMin);
                BigDecimal progress = totalBalance.subtract(currentMin);
                progressPercentage = progress.divide(range, 4, java.math.RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));
                break;
            }
        }
        
        // Get achievement count
        Integer achievementCount = userAchievementRepository.countByUser(user).intValue();
        
        return new UserTierInfo(
                currentTier.getName(),
                currentTier.getTierTitle(),
                currentTier.getTierColor(),
                currentTier.getTierIcon(),
                totalBalance,
                nextTierBalance,
                nextTier != null ? nextTier.getName() : null,
                progressPercentage,
                achievementCount
        );
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalBalance(User user) {
        return accountRepository.findByUser(user).stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional
    @CacheEvict(value = {"user-tiers", "leaderboard"}, allEntries = true)
    public void checkAndAwardAchievements(User user) {
        log.info("Checking achievements for user: {}", user.getUsername());
        BigDecimal totalBalance = getTotalBalance(user);
        
        // Check various achievement conditions
        checkBalanceAchievements(user, totalBalance);
        checkTransactionAchievements(user);
        checkTierAchievements(user);
        
        log.info("Achievement check completed for user: {}", user.getUsername());
    }

    private void checkBalanceAchievements(User user, BigDecimal balance) {
        // Check balance milestones
        checkSingleAchievement(user, "BALANCE_10K", BigDecimal.valueOf(10000), balance);
        checkSingleAchievement(user, "BALANCE_50K", BigDecimal.valueOf(50000), balance);
        checkSingleAchievement(user, "BALANCE_100K", BigDecimal.valueOf(100000), balance);
        checkSingleAchievement(user, "BALANCE_500K", BigDecimal.valueOf(500000), balance);
        checkSingleAchievement(user, "BALANCE_1M", BigDecimal.valueOf(1000000), balance);
    }

    private void checkTransactionAchievements(User user) {
        // Check if user has made transactions
        // This would require additional logic to track transaction counts
        // For now, we'll check if they have any transactions
        // Implementation would depend on transaction tracking needs
    }

    private void checkTierAchievements(User user) {
        Tier currentTier = getUserTier(getTotalBalance(user));
        
        // Award tier-based achievements
        switch (currentTier.getName()) {
            case "SILVER":
                checkSingleAchievement(user, "TIER_SILVER", BigDecimal.ZERO, BigDecimal.ZERO);
                break;
            case "GOLD":
                checkSingleAchievement(user, "TIER_GOLD", BigDecimal.ZERO, BigDecimal.ZERO);
                break;
            case "PLATINUM":
                checkSingleAchievement(user, "TIER_PLATINUM", BigDecimal.ZERO, BigDecimal.ZERO);
                break;
            case "DIAMOND":
                checkSingleAchievement(user, "TIER_DIAMOND", BigDecimal.ZERO, BigDecimal.ZERO);
                break;
        }
    }

    private void checkSingleAchievement(User user, String condition, BigDecimal conditionValue, BigDecimal currentValue) {
        Optional<Achievement> achievementOpt = achievementRepository.findByCondition(condition);
        if (achievementOpt.isPresent()) {
            Achievement achievement = achievementOpt.get();
            
            // Check if user already has this achievement
            if (userAchievementRepository.findByUserAndAchievement(user, achievement).isEmpty()) {
                // Check if condition is met
                boolean conditionMet = false;
                
                switch (condition) {
                    case "BALANCE_10K":
                    case "BALANCE_50K":
                    case "BALANCE_100K":
                    case "BALANCE_500K":
                    case "BALANCE_1M":
                        conditionMet = currentValue.compareTo(achievement.getConditionValue()) >= 0;
                        break;
                    case "TIER_SILVER":
                    case "TIER_GOLD":
                    case "TIER_PLATINUM":
                    case "TIER_DIAMOND":
                        conditionMet = true; // Already checked in checkTierAchievements
                        break;
                    default:
                        conditionMet = false;
                }
                
                if (conditionMet) {
                    // Award achievement
                    UserAchievement userAchievement = new UserAchievement();
                    userAchievement.setUser(user);
                    userAchievement.setAchievement(achievement);
                    userAchievementRepository.save(userAchievement);
                }
            }
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "leaderboard", key = "'top10'")
    public List<com.rpgbank.dto.LeaderboardEntry> getLeaderboard() {
        log.info("Computing leaderboard from database");
        long startTime = System.currentTimeMillis();
        
        // Get top 10 users by balance
        List<Object[]> results = userRepository.findTop10ByTotalBalance();
        
        List<com.rpgbank.dto.LeaderboardEntry> leaderboard = results.stream()
                .map(this::mapToLeaderboardEntry)
                .toList();
        
        long endTime = System.currentTimeMillis();
        log.info("Leaderboard computed in {} ms", endTime - startTime);
        
        return leaderboard;
    }

    private com.rpgbank.dto.LeaderboardEntry mapToLeaderboardEntry(Object[] result) {
        String username = (String) result[0];
        BigDecimal totalBalance = (BigDecimal) result[1];
        Tier tier = getUserTier(totalBalance);
        
        return new com.rpgbank.dto.LeaderboardEntry(
                username,
                tier.getName(),
                tier.getTierTitle(),
                tier.getTierColor(),
                tier.getTierIcon(),
                totalBalance,
                null // Rank will be set by index
        );
    }
}
