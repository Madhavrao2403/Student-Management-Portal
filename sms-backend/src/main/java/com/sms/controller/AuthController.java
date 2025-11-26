package com.sms.controller;

import com.sms.dto.LoginRequest;
import com.sms.dto.LoginResponse;
import com.sms.dto.StudentDTO;
import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.service.StudentService;
import com.sms.service.UserService;
import com.sms.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            User user = userService.findByUsername(loginRequest.getUsername()).orElseThrow();
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

            // Make sure this is the exact response format
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("message", "Login successful");

            System.out.println("Login successful for user: " + user.getUsername() + " with role: " + user.getRole());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login failed for: " + loginRequest.getUsername());
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody StudentDTO studentDTO) {
        Map<String, String> response = new HashMap<>();

        // Check if username already exists
        if (userService.usernameExists(studentDTO.getEmail())) {
            response.put("error", "Email already registered");
            return ResponseEntity.badRequest().body(response);
        }

        // Check if roll number already exists
        if (studentService.rollNumberExists(studentDTO.getRollNumber())) {
            response.put("error", "Roll number already exists");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Create user account - pass passwordEncoder as parameter
            User user = userService.createUser(studentDTO.getEmail(), studentDTO.getPassword(), "student", passwordEncoder);
            // Create student profile
            Student student = studentService.convertToEntity(studentDTO, user);
            studentService.createStudent(student);

            response.put("message", "Registration successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}