package com.project.bank.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/public")
    public Map<String, Object> publicEndpoint(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "✅ Public endpoint - no authentication needed");
        response.put("path", request.getRequestURI());
        response.put("method", request.getMethod());
        return response;
    }
    
    @GetMapping("/secure")
    public Map<String, Object> secureEndpoint(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "🔒 Secure endpoint - you have valid JWT token");
        response.put("path", request.getRequestURI());
        response.put("method", request.getMethod());
        response.put("authorization", request.getHeader("Authorization"));
        return response;
    }
    
    @GetMapping("/check-auth")
    public Map<String, Object> checkAuth(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("requestURI", request.getRequestURI());
        response.put("headers", getHeaders(request));
        response.put("remoteAddr", request.getRemoteAddr());
        return response;
    }
    
    private Map<String, String> getHeaders(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        request.getHeaderNames().asIterator()
            .forEachRemaining(headerName -> 
                headers.put(headerName, request.getHeader(headerName)));
        return headers;
    }
}