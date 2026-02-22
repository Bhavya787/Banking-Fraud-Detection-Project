package com.example.banking.service;

import com.example.banking.model.Account;
import com.example.banking.repository.AccountRepository;
import com.example.banking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
    
    public List<Account> getAccountsByUserEmail(String email) {
        return accountRepository.findByUserEmail(email);
    }

    public Account getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }

    public Account createAccount(Account account, String userEmail) {
        if (account.getBalance() == null) account.setBalance(0.0);
        if (account.getAccountNumber() == null || account.getAccountNumber().isBlank()) {
            account.setAccountNumber(String.valueOf(System.currentTimeMillis()));
        }
        if (account.getMinBalance() == null) {
            if ("SAVINGS".equalsIgnoreCase(account.getAccountType())) {
                account.setMinBalance(2000.0);
            } else if ("CURRENT".equalsIgnoreCase(account.getAccountType())) {
                account.setMinBalance(5000.0);
            } else if ("STUDENT".equalsIgnoreCase(account.getAccountType())) {
                account.setMinBalance(100.0);
            } else {
                account.setMinBalance(0.0);
            }
        }
        
        userRepository.findByEmail(userEmail).ifPresent(account::setUser);
        
        return accountRepository.save(account);
    }

    public Account updateAccount(Account account) {
        if (account == null) {
            throw new IllegalArgumentException("Account cannot be null");
        }
        return accountRepository.save(account);
    }
}
