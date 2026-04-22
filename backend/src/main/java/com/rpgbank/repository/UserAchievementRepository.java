package com.rpgbank.repository;

import com.rpgbank.entity.Achievement;
import com.rpgbank.entity.User;
import com.rpgbank.entity.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    
    List<UserAchievement> findByUserOrderByUnlockedAtDesc(User user);
    
    @Query("SELECT ua FROM UserAchievement ua WHERE ua.user = :user AND ua.achievement = :achievement")
    Optional<UserAchievement> findByUserAndAchievement(User user, Achievement achievement);
    
    @Query("SELECT COUNT(ua) FROM UserAchievement ua WHERE ua.user = :user")
    Long countByUser(User user);
    
    List<UserAchievement> findByAchievementOrderByUnlockedAtDesc(Achievement achievement);
}
