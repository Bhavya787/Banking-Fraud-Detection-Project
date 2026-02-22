package com.example.banking.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private String sourceAccountNumber;
    private String targetAccountNumber;
    private Double amount;
}
