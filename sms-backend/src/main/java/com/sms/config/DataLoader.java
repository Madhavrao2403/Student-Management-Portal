package com.sms.config;

import com.sms.entity.User;
import com.sms.repository.UserRepository;
import com.sms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("admin"); // Use lowercase 'admin'
            userRepository.save(admin);
            System.out.println("Admin user created: admin/admin123 with role: admin");
        }

        // Create sample student user if not exists
        if (userRepository.findByUsername("student1").isEmpty()) {
            User student = new User();
            student.setUsername("student1");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setRole("student"); // Use lowercase 'student'
            userRepository.save(student);
            System.out.println("Sample student created: student1/student123 with role: student");
        }

        // Debug: Print all users
        System.out.println("=== Current Users in Database ===");
        userRepository.findAll().forEach(user -> {
            System.out.println("User: " + user.getUsername() + " | Role: " + user.getRole());
        });
    }
}