package com.example.banking.controller;

import com.example.banking.model.Transaction;
import com.example.banking.dto.TransferRequest;
import com.example.banking.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/transfer")
    public Transaction transferFunds(@RequestBody TransferRequest request) {
        return transactionService.transferFunds(
            request.getSourceAccountNumber(),
            request.getTargetAccountNumber(),
            request.getAmount()
        );
    }

    @GetMapping("/{accountNumber}")
    public List<Transaction> getTransactionHistory(@PathVariable String accountNumber) {
        return transactionService.getTransactionHistory(accountNumber);
    }
    
    @PostMapping("/{accountNumber}/deposit")
    public Transaction deposit(@PathVariable String accountNumber, @RequestBody Map<String, Double> payload) {
        return transactionService.performTransaction(accountNumber, payload.get("amount"), "DEPOSIT");
    }

    @PostMapping("/{accountNumber}/withdraw")
    public Transaction withdraw(@PathVariable String accountNumber, @RequestBody Map<String, Double> payload) {
        return transactionService.performTransaction(accountNumber, payload.get("amount"), "WITHDRAWAL");
    }
}
