package com.rpgbank.service;

import com.rpgbank.entity.Account;
import com.rpgbank.entity.User;
import com.rpgbank.entity.Transaction;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Test class for TransferService using TDD approach
 */
@SpringBootTest
@ExtendWith(MockitoExtension.class)
class TransferServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private AccountRepository accountRepository;
    
    @Mock
    private TransferService transferService;
    
    @InjectMocks
    private TransferService transferServiceToTest;

    private User testUser;
    private Account fromAccount;
    private Account toAccount;
    private List<Account> userAccounts;

    @BeforeEach
    void setUp() {
        // Given: Create test user with initial accounts
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        
        fromAccount = new Account();
        fromAccount.setId(1L);
        fromAccount.setAccountNumber("ACC-001");
        fromAccount.setBalance(new BigDecimal("1000.00"));
        fromAccount.setUser(testUser);
        
        toAccount = new Account();
        toAccount.setId(2L);
        toAccount.setAccountNumber("ACC-002");
        toAccount.setBalance(new BigDecimal("500.00"));
        toAccount.setUser(testUser);
        
        userAccounts = Arrays.asList(fromAccount, toAccount);
        
        // Mock repository behavior
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(accountRepository.findByUser(testUser)).thenReturn(userAccounts);
        when(accountRepository.findById(1L)).thenReturn(Optional.of(fromAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(toAccount));
    }

    @Test
    @DisplayName("송금 이체 시 잔액 부족 예외 발생")
    void transfer_WhenInsufficientFunds_ShouldThrowException() {
        // Given: Transfer amount exceeds from account balance
        BigDecimal transferAmount = new BigDecimal("1500.00");
        
        // When: Attempt transfer
        // Then: Should throw exception
        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferServiceToTest.transfer(1L, 2L, transferAmount);
        });
        
        assertEquals("Insufficient funds", exception.getMessage());
        verify(transferServiceToTest, times(1)).transfer(1L, 2L, transferAmount);
    }

    @Test
    @DisplayName("송금 이체 시 존재하지 않는 계좌 예외 발생")
    void transfer_WhenFromAccountNotFound_ShouldThrowException() {
        // Given: From account doesn't exist
        BigDecimal transferAmount = new BigDecimal("100.00");
        
        // Mock account not found
        when(accountRepository.findById(1L)).thenReturn(Optional.empty());
        
        // When: Attempt transfer
        // Then: Should throw exception
        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferServiceToTest.transfer(1L, 2L, transferAmount);
        });
        
        assertEquals("Source account not found", exception.getMessage());
        verify(transferServiceToTest, never()).transfer(anyLong(), anyLong(), any());
    }

    @Test
    @DisplayName("송금 이체 시 동일 계좌로 이체 시 예외 발생")
    void transfer_WhenSameAccount_ShouldThrowException() {
        // Given: Transfer to same account
        BigDecimal transferAmount = new BigDecimal("100.00");
        
        // When: Attempt transfer
        // Then: Should throw exception
        Exception exception = assertThrows(RuntimeException.class, () -> {
            transferServiceToTest.transfer(1L, 1L, transferAmount);
        });
        
        assertEquals("Cannot transfer to same account", exception.getMessage());
        verify(transferServiceToTest, never()).transfer(anyLong(), anyLong(), any());
    }

    @Test
    @DisplayName("성공적인 송금 이체")
    @Transactional
    void transfer_WhenValidInput_ShouldCompleteSuccessfully() throws Exception {
        // Given: Valid transfer
        BigDecimal transferAmount = new BigDecimal("200.00");
        
        // Mock successful transfer
        doNothing().when(transferServiceToTest).transfer(1L, 2L, transferAmount);
        
        // Mock updated accounts
        Account updatedFromAccount = new Account();
        updatedFromAccount.setId(1L);
        updatedFromAccount.setBalance(new BigDecimal("800.00"));
        
        Account updatedToAccount = new Account();
        updatedToAccount.setId(2L);
        updatedToAccount.setBalance(new BigDecimal("700.00"));
        
        when(accountRepository.findById(1L)).thenReturn(Optional.of(updatedFromAccount));
        when(accountRepository.findById(2L)).thenReturn(Optional.of(updatedToAccount));
        
        // When: Transfer succeeds
        // Then: Should complete successfully
        transferServiceToTest.transfer(1L, 2L, transferAmount);
        
        // Verify transfer was called and accounts were updated
        verify(transferServiceToTest, times(1)).transfer(1L, 2L, transferAmount);
        verify(accountRepository, times(1)).save(updatedFromAccount);
        verify(accountRepository, times(1)).save(updatedToAccount);
        
        // Verify transaction was created
        verify(transferServiceToTest, times(1)).createTransaction(
            argThat(transaction -> transaction.getFromAccount().getId().equals(1L)),
            argThat(transaction -> transaction.getToAccount().getId().equals(2L)),
            argThat(transaction -> transaction.getAmount().equals(transferAmount)),
            argThat(transaction -> transaction.getType().equals("TRANSFER_OUT"))
        );
    }

    @Test
    @DisplayName("송금 이체 시 트랜잭션 생성")
    void transfer_WhenValidInput_ShouldCreateTransaction() throws Exception {
        // Given: Valid transfer
        BigDecimal transferAmount = new BigDecimal("300.00");
        
        // Mock successful transfer
        doNothing().when(transferServiceToTest).transfer(1L, 2L, transferAmount);
        
        // When: Transfer succeeds
        // Then: Should create transaction record
        transferServiceToTest.transfer(1L, 2L, transferAmount);
        
        // Verify transaction was created with correct details
        verify(transferServiceToTest, times(1)).createTransaction(
            argThat(transaction -> transaction.getFromAccount().getId().equals(1L)),
            argThat(transaction -> transaction.getToAccount().getId().equals(2L)),
            argThat(transaction -> transaction.getAmount().equals(transferAmount)),
            argThat(transaction -> transaction.getType().equals("TRANSFER_OUT"))
        );
    }
}
