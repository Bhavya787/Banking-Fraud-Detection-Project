package com.project.bank.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public String home() {
        return """
            <html>
            <body style="font-family: Arial; padding: 20px;">
                <h1>🏦 Banking Fraud Detection System</h1>
                <p>Backend API is running!</p>
                <h3>Available Endpoints:</h3>
                <ul>
                    <li><b>POST</b> /api/auth/register - Register new user</li>
                    <li><b>POST</b> /api/auth/login - Login and get JWT token</li>
                    <li><b>GET</b> /actuator/health - System health check</li>
                </ul>
                <h3>How to test:</h3>
                <pre>
                curl -X POST http://localhost:8080/api/auth/register \\
                  -H "Content-Type: application/json" \\
                  -d '{"username":"test","password":"test123","email":"test@test.com"}'
                </pre>
                <p><a href="/actuator/health">Check Health</a></p>
            </body>
            </html>
            """;
    }
    
    // Redirect to Swagger UI if you add it later
    @GetMapping("/docs")
    public RedirectView redirectToSwagger() {
        return new RedirectView("/swagger-ui/index.html");
    }
}