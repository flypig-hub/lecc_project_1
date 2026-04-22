package com.rpgbank.controller;

import com.rpgbank.dto.AdminStatsDto;
import com.rpgbank.dto.TransactionChartDto;
import com.rpgbank.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminStatsDto> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/transactions/chart")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TransactionChartDto>> getTransactionChart() {
        return ResponseEntity.ok(adminService.getTransactionChartData());
    }
}
