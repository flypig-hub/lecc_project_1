package com.rpgbank.controller;

import com.rpgbank.dto.LeaderboardEntry;
import com.rpgbank.dto.UserTierInfo;
import com.rpgbank.entity.User;
import com.rpgbank.repository.UserRepository;
import com.rpgbank.service.TierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gamification")
@CrossOrigin(origins = "http://localhost:5176")
public class GamificationController {

    @Autowired
    private TierService tierService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/tier")
    public ResponseEntity<UserTierInfo> getUserTierInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserTierInfo tierInfo = tierService.getUserTierInfo(user);
        return ResponseEntity.ok(tierInfo);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard() {
        List<LeaderboardEntry> leaderboard = tierService.getLeaderboard();
        
        // Add ranks
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }
        
        return ResponseEntity.ok(leaderboard);
    }

    @PostMapping("/check-achievements")
    public ResponseEntity<String> checkAchievements() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        tierService.checkAndAwardAchievements(user);
        return ResponseEntity.ok("Achievements checked");
    }
}
