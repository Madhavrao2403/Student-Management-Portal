package com.sms.filter;

import com.sms.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("🔐 JWT Filter - Processing: " + request.getMethod() + " " + request.getRequestURI());

        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (jwtUtil.validateToken(token)) {
                    String username = jwtUtil.extractUsername(token);
                    String role = jwtUtil.extractRole(token);

                    System.out.println("✅ Valid JWT - User: " + username + ", Role: " + role);

                    // Create authentication with ROLE_ prefix
                    String authority = "ROLE_" + role.toUpperCase(); // Use uppercase for consistency

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(username, null,
                                    java.util.Collections.singletonList(
                                            new org.springframework.security.core.authority.SimpleGrantedAuthority(authority)
                                    ));

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set the authentication in context
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    System.out.println("🔐 Security Context SET: " +
                            SecurityContextHolder.getContext().getAuthentication().getName() +
                            " with authorities: " +
                            SecurityContextHolder.getContext().getAuthentication().getAuthorities());

                } else {
                    System.out.println("❌ JWT token invalid");
                    SecurityContextHolder.clearContext();
                }
            } catch (Exception e) {
                System.err.println("❌ JWT processing error: " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
        } else {
            System.out.println("⚠️ No Bearer token found");
            // Don't clear context - it might be set by previous filter
        }

        filterChain.doFilter(request, response);
    }
}