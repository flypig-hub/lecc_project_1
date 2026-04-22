package com.rpgbank.service;

import com.rpgbank.entity.Account;
import com.rpgbank.entity.User;
import com.rpgbank.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

@Service
@RequiredArgsConstructor
public class BankService {
    private final AccountRepository accountRepository;
    private final ReentrantLock lock = new ReentrantLock();

    @Transactional
    public Account createAccount(String accountNumber, Double initialBalance, User user) {
        Account account = new Account(accountNumber, initialBalance, user);
        return accountRepository.save(account);
    }

    @Transactional
    public Account deposit(Long accountId, Double amount) {
        lock.lock();
        try {
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            
            account.setBalance(account.getBalance().add(BigDecimal.valueOf(amount)));
            return accountRepository.save(account);
        } finally {
            lock.unlock();
        }
    }

    @Transactional
    public Account withdraw(Long accountId, Double amount) {
        lock.lock();
        try {
            Account account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            
            BigDecimal amountDecimal = BigDecimal.valueOf(amount);
            if (account.getBalance().compareTo(amountDecimal) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
            
            account.setBalance(account.getBalance().subtract(amountDecimal));
            return accountRepository.save(account);
        } finally {
            lock.unlock();
        }
    }

    @Transactional(readOnly = true)
    public Account getAccount(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Transactional(readOnly = true)
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Account> getAccountsByUser(User user) {
        return accountRepository.findByUser(user);
    }

    @Transactional
    public void applyInterestToAllAccounts(Double interestRate) {
        lock.lock();
        try {
            List<Account> accounts = accountRepository.findAll();
            for (Account account : accounts) {
                BigDecimal interest = account.getBalance().multiply(BigDecimal.valueOf(interestRate));
                account.setBalance(account.getBalance().add(interest));
                accountRepository.save(account);
            }
        } finally {
            lock.unlock();
        }
    }

    @Transactional
    public void transfer(Account fromAccount, Account toAccount, BigDecimal amount) {
        lock.lock();
        try {
            // Check sufficient balance
            if (fromAccount.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
            
            // Perform transfer
            fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
            toAccount.setBalance(toAccount.getBalance().add(amount));
            
            // Save both accounts
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
        } finally {
            lock.unlock();
        }
    }
}
