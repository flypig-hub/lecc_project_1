package com.rpgbank.controller;

import com.rpgbank.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Base controller providing common functionality for all REST controllers
 */
@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public abstract class BaseController {

    /**
     * Standardized success response
     */
    protected <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return ResponseEntity.ok(ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message("Operation completed successfully")
                .timestamp(System.currentTimeMillis())
                .build());
    }

    /**
     * Standardized error response
     */
    protected <T> ResponseEntity<ApiResponse<T>> error(String message, Object data) {
        return ResponseEntity.badRequest(ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .data((T) data)
                .timestamp(System.currentTimeMillis())
                .build());
    }

    /**
     * Handle validation errors
     */
    protected <T> ResponseEntity<ApiResponse<T>> validationError(String fieldName, String message) {
        return error("Validation failed: " + fieldName + " - " + message, null);
    }

    /**
     * Handle resource not found errors
     */
    protected <T> ResponseEntity<ApiResponse<T>> notFound(String resource) {
        return error(resource + " not found", null);
    }

    /**
     * Handle unauthorized access
     */
    protected <T> ResponseEntity<ApiResponse<T>> unauthorized(String message) {
        return ResponseEntity.status(401).body(ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(System.currentTimeMillis())
                .build());
    }

    /**
     * Handle forbidden access
     */
    protected <T> ResponseEntity<ApiResponse<T>> forbidden(String message) {
        return ResponseEntity.status(403).body(ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(System.currentTimeMillis())
                .build());
    }

    /**
     * Handle server errors
     */
    protected <T> ResponseEntity<ApiResponse<T>> internalError(String message) {
        log.error("Internal server error: {}", message);
        return ResponseEntity.status(500).body(ApiResponse.<T>builder()
                .success(false)
                .message("Internal server error: " + message)
                .timestamp(System.currentTimeMillis())
                .build());
    }
}
