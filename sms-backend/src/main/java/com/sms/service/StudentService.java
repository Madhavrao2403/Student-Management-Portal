package com.sms.service;

import com.sms.dto.StudentDTO;
import com.sms.entity.Student;
import com.sms.entity.User;
import com.sms.repository.StudentRepository;
import com.sms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId);
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }

    @Transactional
    public void deleteStudent(Long id) {
        // First find the student to get the associated user
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            User user = student.getUser();

            // Delete the student record first
            studentRepository.deleteById(id);

            // Then delete the user record
            if (user != null) {
                userRepository.delete(user);
            }
        }
    }

    public boolean emailExists(String email) {
        return studentRepository.findByEmail(email).isPresent();
    }

    public boolean rollNumberExists(String rollNumber) {
        return studentRepository.findByRollNumber(rollNumber).isPresent();
    }

    public Student convertToEntity(StudentDTO studentDTO, User user) {
        Student student = new Student();
        updateStudentFromDTO(student, studentDTO);
        student.setUser(user);
        return student;
    }

    public void updateStudentFromDTO(Student student, StudentDTO studentDTO) {
        // Personal Information
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setDateOfBirth(studentDTO.getDateOfBirth());
        student.setGender(studentDTO.getGender());
        student.setBloodGroup(studentDTO.getBloodGroup());
        student.setNationality(studentDTO.getNationality());
        student.setReligion(studentDTO.getReligion());

        // Academic Information
        student.setRollNumber(studentDTO.getRollNumber());
        student.setAdmissionNumber(studentDTO.getAdmissionNumber());
        student.setAdmissionDate(studentDTO.getAdmissionDate());
        student.setDepartment(studentDTO.getDepartment());
        student.setCourse(studentDTO.getCourse());
        student.setYear(studentDTO.getYear());
        student.setSemester(studentDTO.getSemester());
        student.setSection(studentDTO.getSection());
        student.setCurrentCGPA(studentDTO.getCurrentCGPA());
        student.setCurrentSGPA(studentDTO.getCurrentSGPA());
        student.setCreditsCompleted(studentDTO.getCreditsCompleted());
        student.setAcademicStatus(studentDTO.getAcademicStatus());
        student.setAttendancePercentage(studentDTO.getAttendancePercentage());
        student.setClassTeacher(studentDTO.getClassTeacher());
        student.setMentor(studentDTO.getMentor());
        student.setAcademicRemarks(studentDTO.getAcademicRemarks());

        // Contact Information
        student.setEmail(studentDTO.getEmail());
        student.setPhoneNumber(studentDTO.getPhoneNumber());
        student.setAlternatePhone(studentDTO.getAlternatePhone());
        student.setAddress(studentDTO.getAddress());
        student.setCity(studentDTO.getCity());
        student.setState(studentDTO.getState());
        student.setZipCode(studentDTO.getZipCode());
        student.setPermanentAddress(studentDTO.getPermanentAddress());

        // Parent/Guardian Information
        student.setFatherName(studentDTO.getFatherName());
        student.setFatherOccupation(studentDTO.getFatherOccupation());
        student.setFatherPhone(studentDTO.getFatherPhone());
        student.setFatherEmail(studentDTO.getFatherEmail());
        student.setMotherName(studentDTO.getMotherName());
        student.setMotherOccupation(studentDTO.getMotherOccupation());
        student.setMotherPhone(studentDTO.getMotherPhone());
        student.setMotherEmail(studentDTO.getMotherEmail());
        student.setGuardianName(studentDTO.getGuardianName());
        student.setGuardianRelation(studentDTO.getGuardianRelation());
        student.setGuardianPhone(studentDTO.getGuardianPhone());
        student.setGuardianAddress(studentDTO.getGuardianAddress());

        // Emergency Contact
        student.setEmergencyContactName(studentDTO.getEmergencyContactName());
        student.setEmergencyContactRelation(studentDTO.getEmergencyContactRelation());
        student.setEmergencyContactPhone(studentDTO.getEmergencyContactPhone());
        student.setEmergencyContactEmail(studentDTO.getEmergencyContactEmail());

        // Financial Information
        student.setFeeStatus(studentDTO.getFeeStatus());
        student.setTotalFees(studentDTO.getTotalFees());
        student.setFeesPaid(studentDTO.getFeesPaid());
        student.setPendingFees(studentDTO.getPendingFees());
        student.setLastFeePaymentDate(studentDTO.getLastFeePaymentDate());

        // Document & Verification
        student.setDocumentsVerified(studentDTO.getDocumentsVerified());
        student.setIdCardNumber(studentDTO.getIdCardNumber());
        student.setLibraryCardNumber(studentDTO.getLibraryCardNumber());

        // Profile Image
        if (studentDTO.getProfileImage() != null && !studentDTO.getProfileImage().isEmpty()) {
            student.setProfileImage(studentDTO.getProfileImage());
        }
    }

    public StudentDTO convertToDTO(Student student) {
        StudentDTO dto = new StudentDTO();

        // Personal Information
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setDateOfBirth(student.getDateOfBirth());
        dto.setGender(student.getGender());
        dto.setBloodGroup(student.getBloodGroup());
        dto.setNationality(student.getNationality());
        dto.setReligion(student.getReligion());

        // Academic Information
        dto.setRollNumber(student.getRollNumber());
        dto.setAdmissionNumber(student.getAdmissionNumber());
        dto.setAdmissionDate(student.getAdmissionDate());
        dto.setDepartment(student.getDepartment());
        dto.setCourse(student.getCourse());
        dto.setYear(student.getYear());
        dto.setSemester(student.getSemester());
        dto.setSection(student.getSection());
        dto.setCurrentCGPA(student.getCurrentCGPA());
        dto.setCurrentSGPA(student.getCurrentSGPA());
        dto.setCreditsCompleted(student.getCreditsCompleted());
        dto.setAcademicStatus(student.getAcademicStatus());
        dto.setAttendancePercentage(student.getAttendancePercentage());
        dto.setClassTeacher(student.getClassTeacher());
        dto.setMentor(student.getMentor());
        dto.setAcademicRemarks(student.getAcademicRemarks());

        // Contact Information
        dto.setEmail(student.getEmail());
        dto.setPhoneNumber(student.getPhoneNumber());
        dto.setAlternatePhone(student.getAlternatePhone());
        dto.setAddress(student.getAddress());
        dto.setCity(student.getCity());
        dto.setState(student.getState());
        dto.setZipCode(student.getZipCode());
        dto.setPermanentAddress(student.getPermanentAddress());

        // Parent/Guardian Information
        dto.setFatherName(student.getFatherName());
        dto.setFatherOccupation(student.getFatherOccupation());
        dto.setFatherPhone(student.getFatherPhone());
        dto.setFatherEmail(student.getFatherEmail());
        dto.setMotherName(student.getMotherName());
        dto.setMotherOccupation(student.getMotherOccupation());
        dto.setMotherPhone(student.getMotherPhone());
        dto.setMotherEmail(student.getMotherEmail());
        dto.setGuardianName(student.getGuardianName());
        dto.setGuardianRelation(student.getGuardianRelation());
        dto.setGuardianPhone(student.getGuardianPhone());
        dto.setGuardianAddress(student.getGuardianAddress());

        // Emergency Contact
        dto.setEmergencyContactName(student.getEmergencyContactName());
        dto.setEmergencyContactRelation(student.getEmergencyContactRelation());
        dto.setEmergencyContactPhone(student.getEmergencyContactPhone());
        dto.setEmergencyContactEmail(student.getEmergencyContactEmail());

        // Financial Information
        dto.setFeeStatus(student.getFeeStatus());
        dto.setTotalFees(student.getTotalFees());
        dto.setFeesPaid(student.getFeesPaid());
        dto.setPendingFees(student.getPendingFees());
        dto.setLastFeePaymentDate(student.getLastFeePaymentDate());

        // Document & Verification
        dto.setDocumentsVerified(student.getDocumentsVerified());
        dto.setIdCardNumber(student.getIdCardNumber());
        dto.setLibraryCardNumber(student.getLibraryCardNumber());

        // Profile Image
        dto.setProfileImage(student.getProfileImage());

        return dto;
    }
}