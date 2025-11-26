import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../services/api';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const response = await studentAPI.getProfile();
      setStudent(response.data);
      setEditForm(response.data);
    } catch (error) {
      console.error('Error fetching student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.updateProfile(student.id, editForm);
      setShowEditModal(false);
      fetchStudentProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
  };

  // Donut chart data for attendance
  const getAttendanceChartData = (attendancePercentage) => {
    return {
      labels: ['Present', 'Absent'],
      datasets: [
        {
          data: [attendancePercentage, 100 - attendancePercentage],
          backgroundColor: ['#48bb78', '#e53e3e'],
          borderWidth: 2,
          borderColor: '#fff',
          cutout: '70%'
        }
      ]
    };
  };

  const attendanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };

  const calculatePendingFees = (totalFees, feesPaid) => {
    return (totalFees || 0) - (feesPaid || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <i className="fas fa-graduation-cap"></i>
          <span>EduManage Student</span>
        </div>
        <div className="nav-actions">
          <span className="welcome-text">Welcome, {student?.firstName}!</span>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-header">
          <h1>My Dashboard</h1>
          <p>View your academic progress and personal information</p>
        </div>

        {/* Performance Overview */}
        <div className="performance-overview">
          <h2>Academic Performance</h2>
          <div className="performance-cards">
            <div className="performance-card">
              <div className="performance-chart">
                <Doughnut 
                  data={getAttendanceChartData(student.attendancePercentage || 0)} 
                  options={attendanceChartOptions}
                />
              </div>
              <div className="performance-info">
                <h4>Attendance</h4>
                <div className="performance-value">{student.attendancePercentage || 0}%</div>
                <div className="performance-label">Overall Attendance</div>
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-icon gpa">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="performance-info">
                <h4>CGPA</h4>
                <div className="performance-value">{student.currentCGPA || '0.0'}</div>
                <div className="performance-label">Cumulative GPA</div>
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-icon sgpa">
                <i className="fas fa-chart-bar"></i>
              </div>
              <div className="performance-info">
                <h4>SGPA</h4>
                <div className="performance-value">{student.currentSGPA || '0.0'}</div>
                <div className="performance-label">Semester GPA</div>
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-icon credits">
                <i className="fas fa-award"></i>
              </div>
              <div className="performance-info">
                <h4>Credits</h4>
                <div className="performance-value">{student.creditsCompleted || 0}</div>
                <div className="performance-label">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Profile Information */}
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-header">
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={`${student.firstName} ${student.lastName}`}
                  className="profile-image-large"
                />
              ) : (
                <div className="profile-initials-large">
                  {getInitials(student.firstName, student.lastName)}
                </div>
              )}
              <div className="profile-info">
                <h2>{student.firstName} {student.lastName}</h2>
                <p className="student-id">{student.rollNumber}</p>
                <div className="profile-badges">
                  <span className="course-badge">{student.course}</span>
                  <span className="year-badge">Year {student.year}</span>
                  <span className={`status-badge ${student.academicStatus?.toLowerCase()}`}>
                    {student.academicStatus}
                  </span>
                </div>
                <button 
                  className="btn-edit-profile"
                  onClick={() => setShowEditModal(true)}
                >
                  <i className="fas fa-edit"></i>
                  Edit Personal Info
                </button>
              </div>
            </div>

            <div className="profile-details">
              <div className="details-grid">
                {/* Personal Information */}
                <div className="detail-group">
                  <h3>
                    <i className="fas fa-user"></i>
                    Personal Information
                  </h3>
                  <div className="detail-item">
                    <label>Date of Birth</label>
                    <span className="detail-value">{formatDate(student.dateOfBirth)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Gender</label>
                    <span className="detail-value">{student.gender || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Blood Group</label>
                    <span className="detail-value">{student.bloodGroup || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nationality</label>
                    <span className="detail-value">{student.nationality || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Religion</label>
                    <span className="detail-value">{student.religion || 'Not specified'}</span>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="detail-group">
                  <h3>
                    <i className="fas fa-graduation-cap"></i>
                    Academic Information
                  </h3>
                  <div className="detail-item">
                    <label>Admission Number</label>
                    <span className="detail-value">{student.admissionNumber || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Admission Date</label>
                    <span className="detail-value">{formatDate(student.admissionDate)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Department</label>
                    <span className="detail-value">{student.department || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Semester</label>
                    <span className="detail-value">{student.semester || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Section</label>
                    <span className="detail-value">{student.section || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Class Teacher</label>
                    <span className="detail-value">{student.classTeacher || 'Not assigned'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mentor</label>
                    <span className="detail-value">{student.mentor || 'Not assigned'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Academic Remarks</label>
                    <span className="detail-value academic-remarks">{student.academicRemarks || 'No remarks'}</span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="detail-group">
                  <h3>
                    <i className="fas fa-address-book"></i>
                    Contact Information
                  </h3>
                  <div className="detail-item">
                    <label>Email</label>
                    <span className="detail-value">{student.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone Number</label>
                    <span className="detail-value">{student.phoneNumber || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Alternate Phone</label>
                    <span className="detail-value">{student.alternatePhone || 'Not provided'}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Current Address</label>
                    <span className="detail-value">
                      {student.address && <span>{student.address}, </span>}
                      {student.city && <span>{student.city}, </span>}
                      {student.state && <span>{student.state} </span>}
                      {student.zipCode && <span>{student.zipCode}</span>}
                    </span>
                  </div>
                  {student.permanentAddress && (
                    <div className="detail-item full-width">
                      <label>Permanent Address</label>
                      <span className="detail-value">{student.permanentAddress}</span>
                    </div>
                  )}
                </div>

                {/* Parent/Guardian Information */}
                <div className="detail-group">
                  <h3>
                    <i className="fas fa-users"></i>
                    Parent/Guardian Information
                  </h3>
                  <div className="detail-item">
                    <label>Father's Name</label>
                    <span className="detail-value">{student.fatherName || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Father's Occupation</label>
                    <span className="detail-value">{student.fatherOccupation || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Father's Phone</label>
                    <span className="detail-value">{student.fatherPhone || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Father's Email</label>
                    <span className="detail-value">{student.fatherEmail || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mother's Name</label>
                    <span className="detail-value">{student.motherName || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mother's Occupation</label>
                    <span className="detail-value">{student.motherOccupation || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mother's Phone</label>
                    <span className="detail-value">{student.motherPhone || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mother's Email</label>
                    <span className="detail-value">{student.motherEmail || 'Not provided'}</span>
                  </div>
                  {(student.guardianName || student.guardianPhone) && (
                    <>
                      <div className="detail-item">
                        <label>Guardian's Name</label>
                        <span className="detail-value">{student.guardianName || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Relation</label>
                        <span className="detail-value">{student.guardianRelation || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Guardian's Phone</label>
                        <span className="detail-value">{student.guardianPhone || 'Not provided'}</span>
                      </div>
                      <div className="detail-item">
                        <label>Guardian's Address</label>
                        <span className="detail-value">{student.guardianAddress || 'Not provided'}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="detail-group">
                  <h3>
                    <i className="fas fa-phone-alt"></i>
                    Emergency Contact
                  </h3>
                  <div className="detail-item">
                    <label>Emergency Contact Name</label>
                    <span className="detail-value">{student.emergencyContactName || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Relationship</label>
                    <span className="detail-value">{student.emergencyContactRelation || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Emergency Phone</label>
                    <span className="detail-value">{student.emergencyContactPhone || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Emergency Email</label>
                    <span className="detail-value">{student.emergencyContactEmail || 'Not provided'}</span>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="detail-group">
                  <h3>
                    <i className="fas fa-money-bill-wave"></i>
                    Financial Information
                  </h3>
                  <div className="detail-item">
                    <label>Fee Status</label>
                    <span className={`detail-value fee-status ${student.feeStatus?.toLowerCase() || 'pending'}`}>
                      {student.feeStatus || 'Pending'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Total Fees</label>
                    <span className="detail-value">${student.totalFees || '0.00'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Fees Paid</label>
                    <span className="detail-value">${student.feesPaid || '0.00'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Pending Fees</label>
                    <span className="detail-value pending-fees">
                      ${calculatePendingFees(student.totalFees, student.feesPaid).toFixed(2)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Last Payment Date</label>
                    <span className="detail-value">{formatDate(student.lastFeePaymentDate)}</span>
                  </div>
                </div>

                {/* Document & Verification */}
                <div className="detail-group">
                  <h3>
                    <i className="fas fa-file-alt"></i>
                    Document & Verification
                  </h3>
                  <div className="detail-item">
                    <label>Documents Verified</label>
                    <span className={`detail-value ${student.documentsVerified ? 'verified' : 'not-verified'}`}>
                      {student.documentsVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>ID Card Number</label>
                    <span className="detail-value">{student.idCardNumber || 'Not assigned'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Library Card</label>
                    <span className="detail-value">{student.libraryCardNumber || 'Not assigned'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal - Students can only edit personal info */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Personal Information</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName || ''}
                    onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName || ''}
                    onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phoneNumber || ''}
                    onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Alternate Phone</label>
                  <input
                    type="tel"
                    value={editForm.alternatePhone || ''}
                    onChange={(e) => setEditForm({...editForm, alternatePhone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    value={editForm.bloodGroup || ''}
                    onChange={(e) => setEditForm({...editForm, bloodGroup: e.target.value})}
                  >
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
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={editForm.state || ''}
                    onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    value={editForm.zipCode || ''}
                    onChange={(e) => setEditForm({...editForm, zipCode: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Permanent Address</label>
                  <input
                    type="text"
                    value={editForm.permanentAddress || ''}
                    onChange={(e) => setEditForm({...editForm, permanentAddress: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;