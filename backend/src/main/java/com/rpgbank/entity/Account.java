package com.rpgbank.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper=false)
@ToString(callSuper=true)
@Table(name = "accounts")
public class Account extends BaseEntity {
    
    @Column(nullable = false)
    private String accountNumber;
    
    @Column(nullable = false, precision = 19, scale = 2)
    private java.math.BigDecimal balance;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;
    
    public Account(String accountNumber, Double initialBalance, User user) {
        this.accountNumber = accountNumber;
        this.balance = java.math.BigDecimal.valueOf(initialBalance);
        this.user = user;
    }
}
