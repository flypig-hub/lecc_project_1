package com.rpgbank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RpgBankApplication {
    public static void main(String[] args) {
        SpringApplication.run(RpgBankApplication.class, args);
    }
}
