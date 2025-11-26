package com.sms.controller;

import com.sms.dto.StudentDTO;
import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.repository.UserRepository;
import com.sms.service.StudentService;
import com.sms.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUsername(token);
        }
        return null;
    }

    // Student can view their own profile
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<?> getStudent(@PathVariable Long id, HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        User user = userRepository.findByUsername(username).orElseThrow();

        Optional<Student> studentOpt = studentService.getStudentById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Student student = studentOpt.get();

        // Students can only access their own data
        if (user.getRole().equals("student") && !student.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        return ResponseEntity.ok(studentService.convertToDTO(student));
    }

    // Student can update their own profile
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody StudentDTO studentDTO,
                                           HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        User user = userRepository.findByUsername(username).orElseThrow();

        Optional<Student> studentOpt = studentService.getStudentById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Student student = studentOpt.get();

        // Students can only update their own data
        if (user.getRole().equals("student") && !student.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        studentService.updateStudentFromDTO(student, studentDTO);
        Student updatedStudent = studentService.updateStudent(student);

        return ResponseEntity.ok(studentService.convertToDTO(updatedStudent));
    }

    // Student can delete their own account
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id, HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        User user = userRepository.findByUsername(username).orElseThrow();

        Optional<Student> studentOpt = studentService.getStudentById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Student student = studentOpt.get();

        // Students can only delete their own account
        if (user.getRole().equals("student") && !student.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }

    // Get current student's profile
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyProfile(HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        User user = userRepository.findByUsername(username).orElseThrow();

        Optional<Student> studentOpt = studentService.getStudentByUserId(user.getId());
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(studentService.convertToDTO(studentOpt.get()));
    }


}