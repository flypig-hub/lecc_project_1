package com.rpgbank.service;

import com.rpgbank.entity.Achievement;
import com.rpgbank.entity.Tier;
import com.rpgbank.repository.AchievementRepository;
import com.rpgbank.repository.TierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {

    private final TierRepository tierRepository;
    private final AchievementRepository achievementRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeTiers();
        initializeAchievements();
    }

    private void initializeTiers() {
        if (tierRepository.count() == 0) {
            List<Tier> tiers = Arrays.asList(
                new Tier(null, "BRONZE", BigDecimal.ZERO, 0.0, "#CD7F32", "[BRONZE]", "Bronze Adventurer"),
                new Tier(null, "SILVER", BigDecimal.valueOf(10000), 0.1, "#C0C0C0", "[SILVER]", "Silver Hero"),
                new Tier(null, "GOLD", BigDecimal.valueOf(50000), 0.2, "#FFD700", "[GOLD]", "Gold Champion"),
                new Tier(null, "PLATINUM", BigDecimal.valueOf(100000), 0.3, "#E5E4E2", "[PLATINUM]", "Platinum Legend"),
                new Tier(null, "DIAMOND", BigDecimal.valueOf(500000), 0.5, "#B9F2FF", "[DIAMOND]", "Diamond Master")
            );
            
            tierRepository.saveAll(tiers);
            System.out.println("Initialized tiers");
        }
    }

    private void initializeAchievements() {
        if (achievementRepository.count() == 0) {
            List<Achievement> achievements = Arrays.asList(
                // Balance achievements
                new Achievement(null, "First Gold", "Earn your first 10,000 gold", "BALANCE_10K", BigDecimal.valueOf(10000), "[GOLD]", 10, false),
                new Achievement(null, "Silver Hoarder", "Accumulate 50,000 gold", "BALANCE_50K", BigDecimal.valueOf(50000), "[SILVER]", 25, false),
                new Achievement(null, "Gold Baron", "Accumulate 100,000 gold", "BALANCE_100K", BigDecimal.valueOf(100000), "[GOLD]", 50, false),
                new Achievement(null, "Platinum Tycoon", "Accumulate 500,000 gold", "BALANCE_500K", BigDecimal.valueOf(500000), "[PLATINUM]", 100, false),
                new Achievement(null, "Diamond Mogul", "Accumulate 1,000,000 gold", "BALANCE_1M", BigDecimal.valueOf(1000000), "[DIAMOND]", 200, false),
                
                // Tier achievements
                new Achievement(null, "Silver Tier", "Reach Silver tier", "TIER_SILVER", BigDecimal.ZERO, "[SILVER]", 15, false),
                new Achievement(null, "Gold Tier", "Reach Gold tier", "TIER_GOLD", BigDecimal.ZERO, "[GOLD]", 30, false),
                new Achievement(null, "Platinum Tier", "Reach Platinum tier", "TIER_PLATINUM", BigDecimal.ZERO, "[PLATINUM]", 60, false),
                new Achievement(null, "Diamond Tier", "Reach Diamond tier", "TIER_DIAMOND", BigDecimal.ZERO, "[DIAMOND]", 120, false),
                
                // Transaction achievements
                new Achievement(null, "First Transfer", "Complete your first transfer", "FIRST_TRANSFER", BigDecimal.ONE, "[SEND]", 5, false),
                new Achievement(null, "Generous Giver", "Send 10 transfers", "TRANSFER_10", BigDecimal.TEN, "[SEND]", 20, false),
                new Achievement(null, "Master Trader", "Send 50 transfers", "TRANSFER_50", BigDecimal.valueOf(50), "[SEND]", 40, false)
            );
            
            achievementRepository.saveAll(achievements);
            System.out.println("Initialized achievements");
        }
    }
}
