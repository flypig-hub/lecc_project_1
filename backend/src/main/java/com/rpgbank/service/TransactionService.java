package com.rpgbank.service;

import com.rpgbank.dto.TransferRequest;
import com.rpgbank.entity.Account;
import com.rpgbank.entity.Transaction;
import com.rpgbank.entity.User;
import com.rpgbank.repository.AccountRepository;
import com.rpgbank.repository.TransactionRepository;
import com.rpgbank.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final BankService bankService;

    @Transactional(readOnly = true)
    public List<Transaction> getUserTransactions(User user) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user);
    }

    @Transactional
    public Transaction recordTransaction(Transaction.TransactionType type, BigDecimal amount, 
                                     Account account, String description, 
                                     Long fromAccountId, Long toAccountId) {
        Transaction transaction = new Transaction();
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setAccount(account);
        transaction.setDescription(description);
        transaction.setFromAccountId(fromAccountId);
        transaction.setToAccountId(toAccountId);
        
        return transactionRepository.save(transaction);
    }

    @Transactional(rollbackFor = Exception.class)
    public void transferFunds(User sender, TransferRequest transferRequest) {
        // Find recipient user
        User recipient = userRepository.findByUsername(transferRequest.getRecipientUsername())
                .orElseThrow(() -> new RuntimeException("Recipient not found: " + transferRequest.getRecipientUsername()));

        // Prevent self-transfer
        if (sender.getId().equals(recipient.getId())) {
            throw new RuntimeException("Cannot transfer to yourself");
        }

        // Get sender's primary account
        Account senderAccount = accountRepository.findByUser(sender).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No account found for sender"));

        // Get recipient's primary account
        Account recipientAccount = accountRepository.findByUser(recipient).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No account found for recipient"));

        // Check sufficient balance
        if (senderAccount.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // Perform transfer with thread safety
        bankService.transfer(senderAccount, recipientAccount, transferRequest.getAmount());

        // Record transactions for both parties
        String description = transferRequest.getDescription() != null ? 
                transferRequest.getDescription() : 
                "Transfer to " + recipient.getUsername();

        // Record sender's transaction (TRANSFER_SENT)
        recordTransaction(
                Transaction.TransactionType.TRANSFER_SENT,
                transferRequest.getAmount(),
                senderAccount,
                description,
                senderAccount.getId(),
                recipientAccount.getId()
        );

        // Record recipient's transaction (TRANSFER_RECEIVED)
        recordTransaction(
                Transaction.TransactionType.TRANSFER_RECEIVED,
                transferRequest.getAmount(),
                recipientAccount,
                "Transfer from " + sender.getUsername(),
                senderAccount.getId(),
                recipientAccount.getId()
        );
    }

    @Transactional
    public void recordDeposit(Account account, BigDecimal amount) {
        recordTransaction(
                Transaction.TransactionType.DEPOSIT,
                amount,
                account,
                "Deposit",
                null,
                null
        );
    }

    @Transactional
    public void recordWithdrawal(Account account, BigDecimal amount) {
        recordTransaction(
                Transaction.TransactionType.WITHDRAW,
                amount,
                account,
                "Withdrawal",
                null,
                null
        );
    }

    @Transactional
    public void recordInterest(Account account, BigDecimal interestAmount) {
        recordTransaction(
                Transaction.TransactionType.INTEREST,
                interestAmount,
                account,
                "Interest Payment",
                null,
                null
        );
    }
}
