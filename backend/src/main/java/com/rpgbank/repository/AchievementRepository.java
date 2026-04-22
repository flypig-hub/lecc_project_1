package com.rpgbank.repository;

import com.rpgbank.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    
    List<Achievement> findByOrderByAchievementPointsDesc();
    
    Optional<Achievement> findByCondition(String condition);
    
    List<Achievement> findByIsHiddenFalse();
}
