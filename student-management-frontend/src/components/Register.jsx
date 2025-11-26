import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    nationality: '',
    religion: '',

    // Academic Information
    rollNumber: '',
    admissionNumber: '',
    admissionDate: '',
    department: '',
    course: '',
    year: '',
    semester: '',
    section: '',
    currentCGPA: '',
    currentSGPA: '',
    creditsCompleted: '',
    academicStatus: 'Active',
    attendancePercentage: '100',
    classTeacher: '',
    mentor: '',
    academicRemarks: '',

    // Contact Information
    email: '',
    phoneNumber: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    permanentAddress: '',

    // Parent/Guardian Information
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherEmail: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    motherEmail: '',
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    guardianAddress: '',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',

    // Financial Information
    feeStatus: 'Pending',
    totalFees: '',
    feesPaid: '',
    pendingFees: '',
    lastFeePaymentDate: '',

    // Document & Verification
    documentsVerified: false,
    idCardNumber: '',
    libraryCardNumber: '',

    // System
    profileImage: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, GIF)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({
          ...formData,
          profileImage: base64String
        });
        setImagePreview(base64String);
        setError('');
      };

      reader.onerror = () => {
        setError('Failed to read the image file');
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      profileImage: ''
    });
    setImagePreview('');
  };

  const validateStep = (step) => {
    setError('');
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          setError('First name is required');
          return false;
        }
        if (!formData.lastName.trim()) {
          setError('Last name is required');
          return false;
        }
        if (!formData.dateOfBirth) {
          setError('Date of birth is required');
          return false;
        }
        if (!formData.gender) {
          setError('Please select your gender');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.rollNumber.trim()) {
          setError('Roll number is required');
          return false;
        }
        if (!formData.course.trim()) {
          setError('Course is required');
          return false;
        }
        if (!formData.year) {
          setError('Please select your year');
          return false;
        }
        if (!formData.section.trim()) {
          setError('Section is required');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.email.trim()) {
          setError('Email address is required');
          return false;
        }
        if (!formData.phoneNumber.trim()) {
          setError('Phone number is required');
          return false;
        }
        if (!formData.address.trim()) {
          setError('Address is required');
          return false;
        }
        return true;
      
      case 4:
        // Father information is required
        if (!formData.fatherName.trim()) {
          setError('Father\'s name is required');
          return false;
        }
        if (!formData.fatherPhone.trim()) {
          setError('Father\'s phone number is required');
          return false;
        }
        return true;
      
      case 5:
        if (!formData.emergencyContactName.trim()) {
          setError('Emergency contact name is required');
          return false;
        }
        if (!formData.emergencyContactPhone.trim()) {
          setError('Emergency contact phone is required');
          return false;
        }
        return true;
      
      case 6:
        if (!formData.password) {
          setError('Password is required');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        if (!formData.confirmPassword) {
          setError('Please confirm your password');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateStep(6)) {
      setLoading(false);
      return;
    }

    try {
      await authAPI.register(formData);
      setMessage('Registration successful! You can now login with your email and password.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Academic Info' },
    { number: 3, title: 'Contact Info' },
    { number: 4, title: 'Family Info' },
    { number: 5, title: 'Emergency Contact' },
    { number: 6, title: 'Security' }
  ];

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="logo">
            <i className="fas fa-graduation-cap"></i>
            <span>EduManage</span>
          </div>
          <h2>Create Student Account</h2>
          <p>Join our student management system</p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step) => (
            <div key={step.number} className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
              <div className="step-number">{step.number}</div>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form register-form">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder="Your nationality"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  placeholder="Your religion"
                />
              </div>

              {/* Profile Picture Upload */}
              <div className="form-group full-width">
                <label>Profile Picture (Optional)</label>
                <div className="image-upload-section">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Profile preview" />
                      <button type="button" onClick={removeImage} className="remove-image-btn">
                        <i className="fas fa-times"></i>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        id="profileImage"
                      />
                      <label htmlFor="profileImage" className="upload-label">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Click to upload profile picture</span>
                        <small>JPG, PNG, GIF (Max 2MB)</small>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Information */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Academic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter your roll number"
                  />
                </div>
                <div className="form-group">
                  <label>Admission Number</label>
                  <input
                    type="text"
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleChange}
                    placeholder="Admission number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Admission Date</label>
                  <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Course *</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech Computer Science"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <select name="year" value={formData.year} onChange={handleChange} required>
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    placeholder="e.g., Semester 1"
                  />
                </div>
                <div className="form-group">
                  <label>Section *</label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g., A, B, C"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Contact Information</h3>
              <div className="form-group full-width">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="Primary phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Alternate Phone</label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    placeholder="Alternate phone number"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Current Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Your current address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Zip code"
                  />
                </div>
                <div className="form-group">
                  <label>Permanent Address</label>
                  <input
                    type="text"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    placeholder="Permanent address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Family Information */}
          {currentStep === 4 && (
            <div className="form-step">
              <h3>Family Information</h3>
              
              <div className="form-section">
                <h4>Father's Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Father's Name *</label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                      placeholder="Father's full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Father's Occupation</label>
                    <input
                      type="text"
                      name="fatherOccupation"
                      value={formData.fatherOccupation}
                      onChange={handleChange}
                      placeholder="Father's occupation"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Father's Phone *</label>
                    <input
                      type="tel"
                      name="fatherPhone"
                      value={formData.fatherPhone}
                      onChange={handleChange}
                      required
                      placeholder="Father's phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Father's Email</label>
                    <input
                      type="email"
                      name="fatherEmail"
                      value={formData.fatherEmail}
                      onChange={handleChange}
                      placeholder="Father's email"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Mother's Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mother's Name</label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder="Mother's full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mother's Occupation</label>
                    <input
                      type="text"
                      name="motherOccupation"
                      value={formData.motherOccupation}
                      onChange={handleChange}
                      placeholder="Mother's occupation"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Mother's Phone</label>
                    <input
                      type="tel"
                      name="motherPhone"
                      value={formData.motherPhone}
                      onChange={handleChange}
                      placeholder="Mother's phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mother's Email</label>
                    <input
                      type="email"
                      name="motherEmail"
                      value={formData.motherEmail}
                      onChange={handleChange}
                      placeholder="Mother's email"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Guardian Information (If different from parents)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Guardian's Name</label>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleChange}
                      placeholder="Guardian's full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Relation</label>
                    <input
                      type="text"
                      name="guardianRelation"
                      value={formData.guardianRelation}
                      onChange={handleChange}
                      placeholder="Relationship with student"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Guardian's Phone</label>
                    <input
                      type="tel"
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      placeholder="Guardian's phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Guardian's Address</label>
                    <input
                      type="text"
                      name="guardianAddress"
                      value={formData.guardianAddress}
                      onChange={handleChange}
                      placeholder="Guardian's address"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Emergency Contact */}
          {currentStep === 5 && (
            <div className="form-step">
              <h3>Emergency Contact</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Contact Name *</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                  />
                </div>
                <div className="form-group">
                  <label>Relationship *</label>
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Father, Mother, Guardian"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    required
                    placeholder="Emergency phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact Email</label>
                  <input
                    type="email"
                    name="emergencyContactEmail"
                    value={formData.emergencyContactEmail}
                    onChange={handleChange}
                    placeholder="Emergency email"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Security */}
          {currentStep === 6 && (
            <div className="form-step">
              <h3>Account Security</h3>
              <div className="form-group full-width">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password (min 6 characters)"
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group full-width">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <ul>
                  <li className={formData.password.length >= 6 ? 'met' : ''}>
                    At least 6 characters long
                  </li>
                  <li className={formData.password === formData.confirmPassword && formData.password ? 'met' : ''}>
                    Passwords match
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <div>
              {currentStep > 1 && (
                <button type="button" className="btn-secondary" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i>
                  Previous
                </button>
              )}
            </div>
            
            <div>
              {currentStep < 6 ? (
                <button type="button" className="btn-primary" onClick={nextStep}>
                  Next
                  <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      Complete Registration
                      <i className="fas fa-check"></i>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="auth-footer">
          <p>Already have an account? 
            <button onClick={() => navigate('/login')} className="link-btn">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;