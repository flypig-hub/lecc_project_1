package com.rpgbank.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rpgbank.dto.AdminStatsDto;
import com.rpgbank.dto.TransactionChartDto;
import com.rpgbank.entity.User;
import com.rpgbank.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AdminController
 */
@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Autowired
    private UserRepository userRepository;

    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        // Given: Create test users
        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@example.com");
        adminUser.setRole(com.rpgbank.entity.Role.ADMIN);
        
        regularUser = new User();
        regularUser.setId(2L);
        regularUser.setUsername("user");
        regularUser.setEmail("user@example.com");
        regularUser.setRole(com.rpgbank.entity.Role.USER);
        
        // Mock repository
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(regularUser));
    }

    @Test
    @WithMockUser(roles = {"ROLE_ADMIN"})
    @DisplayName("관리자가 시스템 통계 조회 시 성공")
    void getSystemStats_WhenAdminUser_ShouldReturnStats() throws Exception {
        // Given: Admin user with ROLE_ADMIN
        
        // When: Request system stats
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .get("/api/admin/stats")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()));
        
        // Then: Should return 200 OK with stats
        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalUsers").isNumber())
                .andExpect(jsonPath("$.data.totalAccounts").isNumber())
                .andExpect(jsonPath("$.data.totalBalance").isNumber());
    }

    @Test
    @WithMockUser(roles = {"ROLE_USER"})
    @DisplayName("일반 유저가 관리자 API 접근 시 403 Forbidden")
    void getSystemStats_WhenRegularUser_ShouldReturnForbidden() throws Exception {
        // Given: Regular user with ROLE_USER
        
        // When: Request admin endpoint
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .get("/api/admin/stats")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()));
        
        // Then: Should return 403 Forbidden
        result.andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    @DisplayName("인증되지 않은 유저가 관리자 API 접근 시 401 Unauthorized")
    void getSystemStats_WhenUnauthenticatedUser_ShouldReturnUnauthorized() throws Exception {
        // Given: Unauthenticated user
        
        // When: Request admin endpoint
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .get("/api/admin/stats")
                .contentType(MediaType.APPLICATION_JSON));
        
        // Then: Should return 401 Unauthorized
        result.andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    @WithMockUser(roles = {"ROLE_ADMIN"})
    @DisplayName("관리자가 트랜잭션 차트 조회 시 성공")
    void getTransactionChart_WhenAdminUser_ShouldReturnChartData() throws Exception {
        // Given: Admin user with ROLE_ADMIN
        
        // When: Request transaction chart
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .get("/api/admin/transactions/chart")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()));
        
        // Then: Should return 200 OK with chart data
        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].date").exists())
                .andExpect(jsonPath("$.data[0].transactionCount").isNumber())
                .andExpect(jsonPath("$.data[0].totalAmount").isNumber());
    }

    @Test
    @WithMockUser(roles = {"ROLE_ADMIN"})
    @DisplayName("POST 요청 시 405 Method Not Allowed")
    void getSystemStats_WithPostMethod_ShouldReturnMethodNotAllowed() throws Exception {
        // Given: Admin user
        
        // When: Use POST method for GET endpoint
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .post("/api/admin/stats")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}")
                .with(csrf()));
        
        // Then: Should return 405 Method Not Allowed
        result.andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @WithMockUser(roles = {"ROLE_ADMIN"})
    @DisplayName("잘못된 요청 시 400 Bad Request")
    void getTransactionChart_WithInvalidParameters_ShouldReturnBadRequest() throws Exception {
        // Given: Admin user
        
        // When: Request with invalid parameters
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .get("/api/admin/transactions/chart")
                .param("startDate", "invalid-date")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()));
        
        // Then: Should return 400 Bad Request
        result.andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @WithMockUser(roles = {"ROLE_ADMIN"})
    @DisplayName("API 응답 형식 테스트")
    void adminEndpoints_ShouldReturnConsistentResponseFormat() throws Exception {
        // Given: Admin user
        
        // When: Request any admin endpoint
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .get("/api/admin/stats")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()));
        
        // Then: Should return consistent API response format
        result.andExpect(status().isOk())
                .andExpect(jsonPath("$.success").exists())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.data").exists());
    }
}
