package com.rpgbank.repository;

import com.rpgbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    @Query("SELECT u.username, SUM(a.balance) as totalBalance " +
           "FROM User u LEFT JOIN u.accounts a " +
           "GROUP BY u.id, u.username " +
           "ORDER BY totalBalance DESC " +
           "LIMIT 10")
    List<Object[]> findTop10ByTotalBalance();
}
