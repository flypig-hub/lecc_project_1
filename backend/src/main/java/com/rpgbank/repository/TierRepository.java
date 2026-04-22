package com.rpgbank.repository;

import com.rpgbank.entity.Tier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TierRepository extends JpaRepository<Tier, Long> {
    
    List<Tier> findByOrderByMinBalanceAsc();
    
    @Query("SELECT t FROM Tier t WHERE t.minBalance <= :balance ORDER BY t.minBalance DESC LIMIT 1")
    Optional<Tier> findTierByBalance(java.math.BigDecimal balance);
    
    Optional<Tier> findByName(String name);
}
