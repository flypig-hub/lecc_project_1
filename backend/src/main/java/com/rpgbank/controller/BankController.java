package com.rpgbank.controller;

import com.rpgbank.entity.Account;
import com.rpgbank.entity.User;
import com.rpgbank.repository.UserRepository;
import com.rpgbank.service.BankService;
import com.rpgbank.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bank")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5176")
public class BankController {
    private final BankService bankService;
    private final UserRepository userRepository;
    private final TransactionService transactionService;

    @PostMapping("/accounts")
    public ResponseEntity<Account> createAccount(@RequestBody Map<String, Object> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String accountNumber = (String) request.get("accountNumber");
        Double initialBalance = Double.valueOf(request.get("initialBalance").toString());
        Account account = bankService.createAccount(accountNumber, initialBalance, user);
        return ResponseEntity.ok(account);
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<Account>> getUserAccounts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Account> accounts = bankService.getAccountsByUser(user);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable Long id) {
        Account account = bankService.getAccount(id);
        return ResponseEntity.ok(account);
    }

    @PostMapping("/accounts/{id}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Double amount = Double.valueOf(request.get("amount").toString());
        Account account = bankService.deposit(id, amount);
        
        // Record transaction
        transactionService.recordDeposit(account, BigDecimal.valueOf(amount));
        
        return ResponseEntity.ok(account);
    }

    @PostMapping("/accounts/{id}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Double amount = Double.valueOf(request.get("amount").toString());
        Account account = bankService.withdraw(id, amount);
        
        // Record transaction
        transactionService.recordWithdrawal(account, BigDecimal.valueOf(amount));
        
        return ResponseEntity.ok(account);
    }
}
