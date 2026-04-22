package com.rpgbank.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "from_account_id")
    private Long fromAccountId;
    
    @Column(name = "to_account_id")
    private Long toAccountId;
    
    @PrePersist
    protected void onCreate() {
        transactionDate = LocalDateTime.now();
    }
    
    public enum TransactionType {
        DEPOSIT,
        WITHDRAW,
        TRANSFER_SENT,
        TRANSFER_RECEIVED,
        INTEREST
    }
}
