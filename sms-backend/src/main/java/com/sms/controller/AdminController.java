package com.sms.controller;

import com.sms.dto.StudentDTO;
import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.service.StudentService;
import com.sms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/students")
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        List<StudentDTO> studentDTOs = students.stream()
                .map(studentService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(studentDTOs);
    }

    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@RequestBody StudentDTO studentDTO) {
        // Check if email already exists
        if (studentService.emailExists(studentDTO.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }

        // Check if roll number already exists
        if (studentService.rollNumberExists(studentDTO.getRollNumber())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Roll number already exists"));
        }

        try {
            // Create user account - pass passwordEncoder as parameter
            User user = userService.createUser(studentDTO.getEmail(), "student123", "student", passwordEncoder);

            // Create student profile
            Student student = studentService.convertToEntity(studentDTO, user);
            Student createdStudent = studentService.createStudent(student);

            return ResponseEntity.ok(studentService.convertToDTO(createdStudent));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create student: " + e.getMessage()));
        }
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody StudentDTO studentDTO) {
        Optional<Student> studentOpt = studentService.getStudentById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Student student = studentOpt.get();
        studentService.updateStudentFromDTO(student, studentDTO);
        Student updatedStudent = studentService.updateStudent(student);

        return ResponseEntity.ok(studentService.convertToDTO(updatedStudent));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        Optional<Student> studentOpt = studentService.getStudentById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok(Map.of("message", "Student and associated user account deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete student: " + e.getMessage()));
        }
    }
}