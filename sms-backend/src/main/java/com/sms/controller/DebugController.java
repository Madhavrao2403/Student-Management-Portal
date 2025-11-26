package com.sms.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/auth")
    public Map<String, Object> debugAuth(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", auth != null && auth.isAuthenticated());
        response.put("username", auth != null ? auth.getName() : "null");
        response.put("authorities", auth != null ?
                auth.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()) : "null");
        response.put("principal", auth != null ? auth.getPrincipal().getClass().getSimpleName() : "null");
        response.put("requestURI", request.getRequestURI());
        response.put("method", request.getMethod());
        response.put("headers", getHeadersInfo(request));

        System.out.println("🔍 === DEBUG AUTH ===");
        System.out.println("Authenticated: " + response.get("authenticated"));
        System.out.println("Username: " + response.get("username"));
        System.out.println("Authorities: " + response.get("authorities"));
        System.out.println("Request: " + request.getMethod() + " " + request.getRequestURI());

        return response;
    }

    @GetMapping("/admin-test")
    public Map<String, String> adminTest(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        System.out.println("🔍 === ADMIN TEST ===");
        System.out.println("User: " + (auth != null ? auth.getName() : "null"));
        System.out.println("Authorities: " + (auth != null ? auth.getAuthorities() : "null"));
        System.out.println("Request: " + request.getMethod() + " " + request.getRequestURI());

        if (auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin"))) {
            System.out.println("✅ Admin access granted!");
            return Map.of("message", "Admin access granted!");
        } else {
            System.out.println("❌ Admin access denied!");
            return Map.of("error", "Admin access denied!");
        }
    }

    private Map<String, String> getHeadersInfo(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        String authHeader = request.getHeader("Authorization");
        headers.put("Authorization", authHeader != null ?
                authHeader.substring(0, Math.min(authHeader.length(), 50)) + "..." : "null");
        return headers;
    }
}