package com.example.banking.service;

import com.example.banking.model.Account;
import com.example.banking.model.Transaction;
import com.example.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionHistory(String accountNumber) {
        return transactionRepository.findByAccountNumber(accountNumber);
    }

    @Transactional
    public Transaction performTransaction(String accountNumber, Double amount, String type) {
        Account account = accountService.getAccountByNumber(accountNumber);
        if (account == null) throw new RuntimeException("Account not found");

        if ("WITHDRAWAL".equalsIgnoreCase(type) && (account.getBalance() + amount) < (account.getMinBalance() != null ? account.getMinBalance() : 0)) {
            // Amount is negative for withdrawal in this logic? Or we handle it here?
            // Let's assume input amount is positive for withdrawal request, but we subtract it.
            // Actually, let's keep it simple: caller sends negative for withdrawal, positive for deposit.
            // Wait, standard is usually sending positive amount and specifying type.
            throw new RuntimeException("Insufficient funds");
        }

        // We'll handle amount sign based on type
        double transactionAmount = amount;
        if ("WITHDRAWAL".equalsIgnoreCase(type)) {
             if (account.getBalance() < amount) {
                 throw new RuntimeException("Insufficient funds");
             }
             account.setBalance(account.getBalance() - amount);
             transactionAmount = -amount;
        } else if ("DEPOSIT".equalsIgnoreCase(type)) {
             account.setBalance(account.getBalance() + amount);
        }

        accountService.updateAccount(account);

        Transaction transaction = new Transaction();
        transaction.setSourceAccountNumber(accountNumber);
        transaction.setAmount(transactionAmount);
        transaction.setTransactionType(type);
        
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction transferFunds(String fromAccountNum, String toAccountNum, Double amount) {
        Account fromAccount = accountService.getAccountByNumber(fromAccountNum);
        Account toAccount = accountService.getAccountByNumber(toAccountNum);

        if (fromAccount == null || toAccount == null) throw new RuntimeException("Invalid account(s)");
        if (fromAccount.getBalance() < amount) throw new RuntimeException("Insufficient funds");

        fromAccount.setBalance(fromAccount.getBalance() - amount);
        toAccount.setBalance(toAccount.getBalance() + amount);

        accountService.updateAccount(fromAccount);
        accountService.updateAccount(toAccount);

        Transaction transaction = new Transaction();
        transaction.setSourceAccountNumber(fromAccountNum);
        transaction.setTargetAccountNumber(toAccountNum);
        transaction.setAmount(amount);
        transaction.setTransactionType("TRANSFER");

        return transactionRepository.save(transaction);
    }
}
