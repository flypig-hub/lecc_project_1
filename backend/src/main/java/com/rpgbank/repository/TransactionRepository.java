package com.rpgbank.repository;

import com.rpgbank.entity.Transaction;
import com.rpgbank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    @Query("SELECT t FROM Transaction t WHERE t.account.user = :user ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserOrderByTransactionDateDesc(User user);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.user = :user ORDER BY t.transactionDate DESC")
    List<Transaction> findTransactionsByUser(User user);
    
    List<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId);
    
    List<Transaction> findByFromAccountIdOrderByTransactionDateDesc(Long fromAccountId);
    
    List<Transaction> findByToAccountIdOrderByTransactionDateDesc(Long toAccountId);
    
    long countByTransactionDateAfter(LocalDateTime date);
    
    @Query("SELECT t FROM Transaction t WHERE DATE(t.transactionDate) BETWEEN :startDate AND :endDate")
    List<Transaction> findTransactionsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE DATE(t.transactionDate) = :date")
    BigDecimal findTotalAmountByDate(@Param("date") LocalDate date);
}
