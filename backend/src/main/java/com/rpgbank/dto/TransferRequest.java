package com.rpgbank.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {
    
    @NotBlank(message = "Recipient username is required")
    @Size(min = 3, max = 20, message = "Recipient username must be between 3 and 20 characters")
    private String recipientUsername;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @Size(max = 200, message = "Description must not exceed 200 characters")
    private String description;
}
