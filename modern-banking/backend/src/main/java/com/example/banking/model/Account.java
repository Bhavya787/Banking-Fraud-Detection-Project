package com.example.banking.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    private String ownerName;
    private Double balance;
    private Double minBalance;
    
    // Type: "SAVINGS", "CURRENT", "STUDENT"
    private String accountType;

    // Specific fields (nullable if not applicable)
    private Double maxWithdrawLimit; // For Savings
    private String tradeLicenseNumber; // For Current
    private String institutionName; // For Student

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
