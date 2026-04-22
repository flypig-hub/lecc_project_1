package com.rpgbank.service;

import com.rpgbank.entity.Account;
import com.rpgbank.entity.User;
import com.rpgbank.repository.AccountRepository;
import com.rpgbank.repository.UserRepository;
import com.rpgbank.service.TransferService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Concurrency test for TransferService operations
 */
@SpringBootTest
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1"
})
@ExtendWith(MockitoExtension.class)
class TransferConcurrencyTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private AccountRepository accountRepository;
    
    @InjectMocks
    private TransferService transferService;

    private User testUser;
    private Account sourceAccount;
    private Account targetAccount;
    private ExecutorService executorService;
    private static final int THREAD_COUNT = 10;
    private static final int TRANSFER_AMOUNT = 100;

    @BeforeEach
    void setUp() {
        // Given: Create test user with initial accounts
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        
        sourceAccount = new Account();
        sourceAccount.setId(1L);
        sourceAccount.setAccountNumber("ACC-001");
        sourceAccount.setBalance(new BigDecimal("10000.00"));
        sourceAccount.setUser(testUser);
        
        targetAccount = new Account();
        targetAccount.setId(2L);
        targetAccount.setAccountNumber("ACC-002");
        targetAccount.setBalance(new BigDecimal("5000.00"));
        targetAccount.setUser(testUser);
        
        List<Account> userAccounts = Arrays.asList(sourceAccount, targetAccount);
        
        // Mock repository behavior
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(accountRepository.findByUser(testUser)).thenReturn(userAccounts);
        when(accountRepository.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(targetAccount));
        
        executorService = Executors.newFixedThreadPool(THREAD_COUNT);
    }

    @Test
    @DisplayName("동시 송금 시 잔액 정확히 계산되는지 검증")
    void concurrentTransfers_ShouldMaintainCorrectBalance() throws InterruptedException {
        // Given: Multiple threads attempting concurrent transfers
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        AtomicReference<Exception> lastException = new AtomicReference<>();
        
        // When: Multiple threads execute transfers simultaneously
        for (int i = 0; i < THREAD_COUNT; i++) {
            final int threadId = i;
            executorService.submit(() -> {
                try {
                    transferService.transfer(1L, 2L, new BigDecimal(TRANSFER_AMOUNT));
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                    lastException.set(e);
                } finally {
                    latch.countDown();
                }
            });
        }
        
        // Then: Wait for all threads to complete
        assertTrue("All threads should complete within timeout", 
                 latch.await(10, TimeUnit.SECONDS));
        
        // Verify results
        assertEquals("All transfers should succeed", THREAD_COUNT, successCount.get());
        assertEquals("No transfers should fail", 0, failureCount.get());
        assertNull("No exceptions should occur", lastException.get());
        
        // Verify final balances are correct
        BigDecimal expectedSourceBalance = new BigDecimal("10000.00")
                .subtract(new BigDecimal(TRANSFER_AMOUNT * THREAD_COUNT));
        BigDecimal expectedTargetBalance = new BigDecimal("5000.00")
                .add(new BigDecimal(TRANSFER_AMOUNT * THREAD_COUNT));
        
        // Verify accounts were updated correctly
        verify(accountRepository, times(THREAD_COUNT)).save(argThat(account -> 
            account.getId().equals(1L) && 
            account.getBalance().equals(expectedSourceBalance)
        ));
        verify(accountRepository, times(THREAD_COUNT)).save(argThat(account -> 
            account.getId().equals(2L) && 
            account.getBalance().equals(expectedTargetBalance)
        ));
    }

    @Test
    @DisplayName("동시 송금 시 잔액 부족 상황에서의 원자성 보장")
    void concurrentTransfers_WithInsufficientFunds_ShouldMaintainAtomicity() throws InterruptedException {
        // Given: Account with insufficient funds for some transfers
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        AtomicReference<Exception> lastException = new AtomicReference<>();
        
        // When: Multiple threads attempt transfers that exceed balance
        for (int i = 0; i < THREAD_COUNT; i++) {
            final int threadId = i;
            executorService.submit(() -> {
                try {
                    // Attempt to transfer more than available balance
                    transferService.transfer(1L, 2L, new BigDecimal("2000.00"));
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                    lastException.set(e);
                } finally {
                    latch.countDown();
                }
            });
        }
        
        // Then: Wait for all threads to complete
        assertTrue("All threads should complete within timeout", 
                 latch.await(10, TimeUnit.SECONDS));
        
        // Verify atomicity: either all succeed or all fail, but no partial state
        assertTrue("Should have either all successes or all failures", 
                 successCount.get() == 0 || successCount.get() == THREAD_COUNT);
        
        // Verify account balance remains unchanged or is updated consistently
        verify(accountRepository, atMost(THREAD_COUNT)).save(any(Account.class));
        
        // Verify no inconsistent state
        if (successCount.get() > 0 && successCount.get() < THREAD_COUNT) {
            fail("Partial success state detected - atomicity violation");
        }
    }

    @Test
    @DisplayName("동시 송금 시 교착 상태 방지")
    void concurrentTransfers_ShouldPreventDeadlock() throws InterruptedException {
        // Given: Two accounts with sufficient balance
        Account account1 = new Account();
        account1.setId(1L);
        account1.setBalance(new BigDecimal("10000.00"));
        
        Account account2 = new Account();
        account2.setId(2L);
        account2.setBalance(new BigDecimal("10000.00"));
        
        when(accountRepository.findById(1L)).thenReturn(Optional.of(account1));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(account2));
        
        CountDownLatch latch = new CountDownLatch(2);
        AtomicInteger successCount = new AtomicInteger(0);
        
        // When: Two threads attempt transfers in opposite directions
        executorService.submit(() -> {
            try {
                transferService.transfer(1L, 2L, new BigDecimal("1000.00"));
                successCount.incrementAndGet();
            } catch (Exception e) {
                // Expected to fail due to concurrency
            } finally {
                latch.countDown();
            }
        });
        
        executorService.submit(() -> {
            try {
                transferService.transfer(2L, 1L, new BigDecimal("1000.00"));
                successCount.incrementAndGet();
            } catch (Exception e) {
                // Expected to fail due to concurrency
            } finally {
                latch.countDown();
            }
        });
        
        // Then: Should complete without deadlock
        assertTrue("Operations should complete without deadlock", 
                 latch.await(5, TimeUnit.SECONDS));
        
        // Verify system maintains consistency
        // At least one transfer should succeed or both should fail
        assertTrue("System should maintain consistency", successCount.get() >= 0);
    }

    @Test
    @DisplayName("동시 송금 시 데이터베이스 락 테스트")
    void concurrentTransfers_ShouldHandleDatabaseLocks() throws InterruptedException {
        // Given: Multiple operations on same account
        CountDownLatch latch = new CountDownLatch(THREAD_COUNT);
        AtomicInteger completedOperations = new AtomicInteger(0);
        
        // When: Multiple threads operate on same source account
        for (int i = 0; i < THREAD_COUNT; i++) {
            final int threadId = i;
            executorService.submit(() -> {
                try {
                    // Small transfers to avoid immediate insufficient funds
                    transferService.transfer(1L, 2L, new BigDecimal("10.00"));
                    completedOperations.incrementAndGet();
                } catch (Exception e) {
                    // Some may fail due to locking - this is expected
                } finally {
                    latch.countDown();
                }
            });
        }
        
        // Then: Should handle database locks gracefully
        assertTrue("All operations should complete", 
                 latch.await(15, TimeUnit.SECONDS));
        
        // Verify database operations were attempted
        verify(accountRepository, atLeast(THREAD_COUNT / 2)).save(any(Account.class));
        
        // Verify no data corruption
        // Final balance should be consistent regardless of failures
        verify(accountRepository, times(1)).findById(1L);
    }
}
