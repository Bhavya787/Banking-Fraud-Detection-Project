package com.example.banking.controller;

import com.example.banking.model.Account;
import com.example.banking.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public List<Account> getAllAccounts(Authentication authentication) {
        String email = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (isAdmin) {
            return accountService.getAllAccounts();
        } else {
            return accountService.getAccountsByUserEmail(email);
        }
    }

    @PostMapping
    public Account createAccount(@RequestBody Account account, Authentication authentication) {
        return accountService.createAccount(account, authentication.getName());
    }
    
    @GetMapping("/{accountNumber}")
    public Account getAccount(@PathVariable String accountNumber, Authentication authentication) {
        // Add check to ensure user owns this account or is admin
        return accountService.getAccountByNumber(accountNumber);
    }
}
