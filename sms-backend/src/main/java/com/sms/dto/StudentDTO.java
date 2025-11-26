package com.sms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentDTO {
    private Long id;

    // Personal Information
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String nationality;
    private String religion;

    // Academic Information
    private String rollNumber;
    private String admissionNumber;
    private LocalDate admissionDate;
    private String department;
    private String course;
    private Integer year;
    private String semester;
    private String section;
    private String currentCGPA;
    private String currentSGPA;
    private Integer creditsCompleted;
    private String academicStatus;
    private Integer attendancePercentage;
    private String classTeacher;
    private String mentor;
    private String academicRemarks;

    // Contact Information
    private String email;
    private String phoneNumber;
    private String alternatePhone;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String permanentAddress;

    // Parent/Guardian Information
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

    // Emergency Contact
    private String emergencyContactName;
    private String emergencyContactRelation;
    private String emergencyContactPhone;
    private String emergencyContactEmail;

    // Financial Information
    private String feeStatus;
    private Double totalFees;
    private Double feesPaid;
    private Double pendingFees;
    private LocalDate lastFeePaymentDate;

    // Document & Verification
    private Boolean documentsVerified;
    private String idCardNumber;
    private String libraryCardNumber;

    // System
    private String profileImage;
    private String password;
    private String confirmPassword;
}