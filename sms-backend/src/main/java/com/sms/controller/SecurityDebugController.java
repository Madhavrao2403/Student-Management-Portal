package com.sms.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/security")
public class SecurityDebugController {

    @GetMapping("/context")
    public Map<String, Object> getSecurityContext(HttpServletRequest request) {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication auth = context.getAuthentication();

        Map<String, Object> response = new HashMap<>();
        response.put("contextHash", context.hashCode());
        response.put("authentication", auth != null ? auth.getName() : "null");
        response.put("authorities", auth != null ? auth.getAuthorities().toString() : "null");
        response.put("authenticated", auth != null && auth.isAuthenticated());
        response.put("requestURI", request.getRequestURI());
        response.put("sessionId", request.getSession().getId());

        System.out.println("🔍 Security Context: " + response);

        return response;
    }
}