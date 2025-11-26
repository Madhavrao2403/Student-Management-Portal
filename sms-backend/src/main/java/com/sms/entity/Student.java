package com.sms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== PERSONAL INFORMATION =====
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String nationality;
    private String religion;

    // ===== ACADEMIC INFORMATION =====
    @Column(unique = true)
    private String rollNumber;

    private String admissionNumber;
    private LocalDate admissionDate;
    private String department;
    private String course;
    private Integer year;
    private String semester;
    private String section;

    // Academic Performance
    private String currentCGPA;
    private String currentSGPA;
    private Integer creditsCompleted;
    private String academicStatus;
    private Integer attendancePercentage;

    // Academic Staff
    private String classTeacher;
    private String mentor;
    private String academicRemarks;

    // ===== CONTACT INFORMATION =====
    @Column(unique = true)
    private String email;
    private String phoneNumber;
    private String alternatePhone;

    // Address
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String permanentAddress;

    // ===== PARENT/GUARDIAN INFORMATION =====
    private String fatherName;
    private String fatherOccupation;
    private String fatherPhone;
    private String fatherEmail;

    private String motherName;
    private String motherOccupation;
    private String motherPhone;
    private String motherEmail;

    private String guardianName;
    private String guardianRelation;
    private String guardianPhone;
    private String guardianAddress;

    // ===== EMERGENCY CONTACT =====
    private String emergencyContactName;
    private String emergencyContactRelation;
    private String emergencyContactPhone;
    private String emergencyContactEmail;

    // ===== FINANCIAL INFORMATION =====
    private String feeStatus;
    private Double totalFees;
    private Double feesPaid;
    private Double pendingFees;
    private LocalDate lastFeePaymentDate;

    // ===== DOCUMENT & VERIFICATION =====
    private Boolean documentsVerified;
    private String idCardNumber;
    private String libraryCardNumber;

    // ===== SYSTEM INFORMATION =====
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        // Set default values
        if (this.academicStatus == null) this.academicStatus = "Active";
        if (this.feeStatus == null) this.feeStatus = "Pending";
        if (this.documentsVerified == null) this.documentsVerified = false;
        if (this.attendancePercentage == null) this.attendancePercentage = 100;
        if (this.currentCGPA == null) this.currentCGPA = "0.0";
        if (this.currentSGPA == null) this.currentSGPA = "0.0";
        if (this.creditsCompleted == null) this.creditsCompleted = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}