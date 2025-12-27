package com.project.bank.controller;

import com.project.bank.dto.AuthRequest;
import com.project.bank.dto.AuthResponse;
import com.project.bank.entity.User;
import com.project.bank.repository.UserRepository;
import com.project.bank.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        // Check if user exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Username already exists", null, null));
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Email already exists", null, null));
        }
        
        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .role(User.Role.CUSTOMER) // Default role
                .build();
        
        userRepository.save(user);
        
        // Generate token
        String token = jwtService.generateToken(user);
        
        return ResponseEntity.ok(new AuthResponse(
                token, 
                "Registration successful", 
                user.getUsername(), 
                user.getRole().name()
        ));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // 1. Find user
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // 2. Manual password check (replaces AuthenticationManager)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401)
                    .body(new AuthResponse(null, "Invalid credentials", null, null));
        }
        
        // 3. Generate token
        String token = jwtService.generateToken(user);
        
        return ResponseEntity.ok(new AuthResponse(
                token,
                "Login successful",
                user.getUsername(),
                user.getRole().name()
        ));
    }
}