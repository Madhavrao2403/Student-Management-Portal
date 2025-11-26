import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getAllStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminAPI.deleteStudent(studentId);
        setStudents(students.filter(student => student.id !== studentId));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditForm({ ...student });
    setShowEditModal(true);
    setActiveTab('academic');
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateStudent(selectedStudent.id, editForm);
      setShowEditModal(false);
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  return (
    <div className="dashboard-container">
      {/* Navigation Header */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <i className="fas fa-graduation-cap"></i>
          <span>EduManage Admin</span>
        </div>
        <div className="nav-actions">
          <span className="welcome-text">Welcome, Admin!</span>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-header">
          <h1>Student Management</h1>
          <p>Manage all student accounts and information</p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total-students">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>{students.length}</h3>
              <p>Total Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="stat-info">
              <h3>{students.filter(s => s.academicStatus === 'Active').length}</h3>
              <p>Active Students</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon financial">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="stat-info">
              <h3>{students.filter(s => s.feeStatus === 'Paid').length}</h3>
              <p>Fees Paid</p>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="table-section">
          <div className="section-header">
            <h2>All Students</h2>
            <button className="refresh-btn" onClick={fetchStudents}>
              <i className="fas fa-sync-alt"></i>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-user-graduate"></i>
              <h3>No Students Found</h3>
              <p>There are no students registered in the system yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Attendance</th>
                    <th>Fee Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="student-row">
                      <td>
                        {student.profileImage ? (
                          <img 
                            src={student.profileImage} 
                            alt={`${student.firstName} ${student.lastName}`}
                            className="profile-image"
                          />
                        ) : (
                          <div className="profile-initials">
                            {getInitials(student.firstName, student.lastName)}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="student-name">
                          {student.firstName} {student.lastName}
                        </div>
                      </td>
                      <td>{student.rollNumber}</td>
                      <td>
                        <span className="course-badge">{student.course}</span>
                      </td>
                      <td>
                        <span className="year-badge">Year {student.year}</span>
                      </td>
                      <td>
                        <div className="attendance-display">
                          <div className="attendance-circle">
                            <span>{student.attendancePercentage || 0}%</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`fee-status ${student.feeStatus?.toLowerCase() || 'pending'}`}>
                          {student.feeStatus || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-view"
                            onClick={() => handleView(student)}
                          >
                            <i className="fas fa-eye"></i>
                            View
                          </button>
                          <button 
                            className="btn-edit"
                            onClick={() => handleEdit(student)}
                          >
                            <i className="fas fa-edit"></i>
                            Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(student.id)}
                          >
                            <i className="fas fa-trash"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Student Modal - Show ALL Details */}
      {showViewModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content view-modal">
            <div className="modal-header">
              <h3>Complete Student Details</h3>
              <button 
                className="close-btn"
                onClick={() => setShowViewModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="student-details">
              {/* Profile Header */}
              <div className="detail-header">
                <div className="detail-profile">
                  {selectedStudent.profileImage ? (
                    <img 
                      src={selectedStudent.profileImage} 
                      alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                      className="detail-profile-image"
                    />
                  ) : (
                    <div className="detail-profile-initials">
                      {getInitials(selectedStudent.firstName, selectedStudent.lastName)}
                    </div>
                  )}
                </div>
                <div className="detail-profile-info">
                  <h2>{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                  <p className="detail-roll">{selectedStudent.rollNumber}</p>
                  <div className="detail-badges">
                    <span className="course-badge-large">{selectedStudent.course}</span>
                    <span className="year-badge-large">Year {selectedStudent.year}</span>
                    <span className={`status-badge ${selectedStudent.academicStatus?.toLowerCase()}`}>
                      {selectedStudent.academicStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Performance Cards */}
              <div className="performance-cards">
                <div className="performance-card">
                  <div className="performance-chart">
                    <Doughnut 
                      data={getAttendanceChartData(selectedStudent.attendancePercentage || 0)} 
                      options={attendanceChartOptions}
                    />
                  </div>
                  <div className="performance-info">
                    <h4>Attendance</h4>
                    <div className="performance-value">{selectedStudent.attendancePercentage || 0}%</div>
                  </div>
                </div>

                <div className="performance-card">
                  <div className="performance-icon gpa">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="performance-info">
                    <h4>CGPA</h4>
                    <div className="performance-value">{selectedStudent.currentCGPA || '0.0'}</div>
                  </div>
                </div>

                <div className="performance-card">
                  <div className="performance-icon sgpa">
                    <i className="fas fa-chart-bar"></i>
                  </div>
                  <div className="performance-info">
                    <h4>SGPA</h4>
                    <div className="performance-value">{selectedStudent.currentSGPA || '0.0'}</div>
                  </div>
                </div>

                <div className="performance-card">
                  <div className="performance-icon credits">
                    <i className="fas fa-award"></i>
                  </div>
                  <div className="performance-info">
                    <h4>Credits</h4>
                    <div className="performance-value">{selectedStudent.creditsCompleted || 0}</div>
                  </div>
                </div>
              </div>

              {/* Details Grid - Show ALL Information */}
              <div className="details-grid-modal">
                {/* Personal Information */}
                <div className="detail-section">
                  <h4>
                    <i className="fas fa-user"></i>
                    Personal Information
                  </h4>
                  <div className="detail-row">
                    <div className="detail-item-modal">
                      <label>Full Name</label>
                      <span>{selectedStudent.firstName} {selectedStudent.lastName}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Date of Birth</label>
                      <span>{formatDate(selectedStudent.dateOfBirth)}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Gender</label>
                      <span>{selectedStudent.gender || 'Not specified'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Blood Group</label>
                      <span>{selectedStudent.bloodGroup || 'Not specified'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Nationality</label>
                      <span>{selectedStudent.nationality || 'Not specified'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Religion</label>
                      <span>{selectedStudent.religion || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="detail-section">
                  <h4>
                    <i className="fas fa-graduation-cap"></i>
                    Academic Information
                  </h4>
                  <div className="detail-row">
                    <div className="detail-item-modal">
                      <label>Roll Number</label>
                      <span>{selectedStudent.rollNumber}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Admission Number</label>
                      <span>{selectedStudent.admissionNumber || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Admission Date</label>
                      <span>{formatDate(selectedStudent.admissionDate)}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Course</label>
                      <span>{selectedStudent.course}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Department</label>
                      <span>{selectedStudent.department || 'Not specified'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Year</label>
                      <span>Year {selectedStudent.year}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Semester</label>
                      <span>{selectedStudent.semester || 'Not specified'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Section</label>
                      <span>{selectedStudent.section || 'Not specified'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Class Teacher</label>
                      <span>{selectedStudent.classTeacher || 'Not assigned'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Mentor</label>
                      <span>{selectedStudent.mentor || 'Not assigned'}</span>
                    </div>
                    <div className="detail-item-modal full-width">
                      <label>Academic Remarks</label>
                      <span className="academic-remarks">{selectedStudent.academicRemarks || 'No remarks'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="detail-section">
                  <h4>
                    <i className="fas fa-address-book"></i>
                    Contact Information
                  </h4>
                  <div className="detail-row">
                    <div className="detail-item-modal">
                      <label>Email</label>
                      <span>{selectedStudent.email}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Phone Number</label>
                      <span>{selectedStudent.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Alternate Phone</label>
                      <span>{selectedStudent.alternatePhone || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="detail-address">
                    <h5>Current Address</h5>
                    <p>
                      {selectedStudent.address && <span>{selectedStudent.address}, </span>}
                      {selectedStudent.city && <span>{selectedStudent.city}, </span>}
                      {selectedStudent.state && <span>{selectedStudent.state} </span>}
                      {selectedStudent.zipCode && <span>{selectedStudent.zipCode}</span>}
                    </p>
                  </div>
                  {selectedStudent.permanentAddress && (
                    <div className="detail-address">
                      <h5>Permanent Address</h5>
                      <p>{selectedStudent.permanentAddress}</p>
                    </div>
                  )}
                </div>

                {/* Parent/Guardian Information */}
                <div className="detail-section">
                  <h4>
                    <i className="fas fa-users"></i>
                    Parent/Guardian Information
                  </h4>
                  <div className="detail-row">
                    <div className="detail-item-modal">
                      <label>Father's Name</label>
                      <span>{selectedStudent.fatherName || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Father's Occupation</label>
                      <span>{selectedStudent.fatherOccupation || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Father's Phone</label>
                      <span>{selectedStudent.fatherPhone || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Father's Email</label>
                      <span>{selectedStudent.fatherEmail || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item-modal">
                      <label>Mother's Name</label>
                      <span>{selectedStudent.motherName || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Mother's Occupation</label>
                      <span>{selectedStudent.motherOccupation || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Mother's Phone</label>
                      <span>{selectedStudent.motherPhone || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Mother's Email</label>
                      <span>{selectedStudent.motherEmail || 'Not provided'}</span>
                    </div>
                  </div>
                  {(selectedStudent.guardianName || selectedStudent.guardianPhone) && (
                    <div className="detail-row">
                      <div className="detail-item-modal">
                        <label>Guardian's Name</label>
                        <span>{selectedStudent.guardianName || 'Not provided'}</span>
                      </div>
                      <div className="detail-item-modal">
                        <label>Relation</label>
                        <span>{selectedStudent.guardianRelation || 'Not provided'}</span>
                      </div>
                      <div className="detail-item-modal">
                        <label>Guardian's Phone</label>
                        <span>{selectedStudent.guardianPhone || 'Not provided'}</span>
                      </div>
                      <div className="detail-item-modal">
                        <label>Guardian's Address</label>
                        <span>{selectedStudent.guardianAddress || 'Not provided'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="detail-section">
                  <h4>
                    <i className="fas fa-phone-alt"></i>
                    Emergency Contact
                  </h4>
                  <div className="detail-row">
                    <div className="detail-item-modal">
                      <label>Emergency Contact Name</label>
                      <span>{selectedStudent.emergencyContactName || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Relationship</label>
                      <span>{selectedStudent.emergencyContactRelation || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Emergency Phone</label>
                      <span>{selectedStudent.emergencyContactPhone || 'Not provided'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Emergency Email</label>
                      <span>{selectedStudent.emergencyContactEmail || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="detail-section">
                  <h4>
                    <i className="fas fa-money-bill-wave"></i>
                    Financial Information
                  </h4>
                  <div className="detail-row">
                    <div className="detail-item-modal">
                      <label>Fee Status</label>
                      <span className={`fee-status ${selectedStudent.feeStatus?.toLowerCase() || 'pending'}`}>
                        {selectedStudent.feeStatus || 'Pending'}
                      </span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Total Fees</label>
                      <span>${selectedStudent.totalFees || '0.00'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Fees Paid</label>
                      <span>${selectedStudent.feesPaid || '0.00'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Pending Fees</label>
                      <span className="pending-fees">
                        ${calculatePendingFees(selectedStudent.totalFees, selectedStudent.feesPaid).toFixed(2)}
                      </span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Last Payment Date</label>
                      <span>{formatDate(selectedStudent.lastFeePaymentDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Document & Verification */}
                <div className="detail-section">
                  <h4>
                    <i className="fas fa-file-alt"></i>
                    Document & Verification
                  </h4>
                  <div className="detail-row">
                    <div className="detail-item-modal">
                      <label>Documents Verified</label>
                      <span className={selectedStudent.documentsVerified ? 'verified' : 'not-verified'}>
                        {selectedStudent.documentsVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="detail-item-modal">
                      <label>ID Card Number</label>
                      <span>{selectedStudent.idCardNumber || 'Not assigned'}</span>
                    </div>
                    <div className="detail-item-modal">
                      <label>Library Card</label>
                      <span>{selectedStudent.libraryCardNumber || 'Not assigned'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedStudent);
                }}
              >
                <i className="fas fa-edit"></i>
                Edit Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Admin can edit academic and financial info */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content edit-modal">
            <div className="modal-header">
              <h3>Edit Student Information</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="edit-tabs">
              <button 
                className={`tab-button ${activeTab === 'academic' ? 'active' : ''}`}
                onClick={() => setActiveTab('academic')}
              >
                <i className="fas fa-graduation-cap"></i>
                Academic
              </button>
              <button 
                className={`tab-button ${activeTab === 'financial' ? 'active' : ''}`}
                onClick={() => setActiveTab('financial')}
              >
                <i className="fas fa-money-bill-wave"></i>
                Financial
              </button>
              <button 
                className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <i className="fas fa-file-alt"></i>
                Documents
              </button>
            </div>

            <form onSubmit={handleUpdate} className="modal-form">
              {/* Academic Tab */}
              {activeTab === 'academic' && (
                <div className="tab-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Current CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={editForm.currentCGPA || ''}
                        onChange={(e) => setEditForm({...editForm, currentCGPA: e.target.value})}
                        placeholder="Enter CGPA"
                      />
                    </div>
                    <div className="form-group">
                      <label>Current SGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={editForm.currentSGPA || ''}
                        onChange={(e) => setEditForm({...editForm, currentSGPA: e.target.value})}
                        placeholder="Enter SGPA"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Credits Completed</label>
                      <input
                        type="number"
                        value={editForm.creditsCompleted || ''}
                        onChange={(e) => setEditForm({...editForm, creditsCompleted: parseInt(e.target.value) || 0})}
                        placeholder="Completed credits"
                      />
                    </div>
                    <div className="form-group">
                      <label>Attendance Percentage</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editForm.attendancePercentage || ''}
                        onChange={(e) => setEditForm({...editForm, attendancePercentage: parseInt(e.target.value) || 0})}
                        placeholder="Attendance %"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Academic Status</label>
                      <select
                        value={editForm.academicStatus || 'Active'}
                        onChange={(e) => setEditForm({...editForm, academicStatus: e.target.value})}
                      >
                        <option value="Active">Active</option>
                        <option value="Probation">Probation</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Dropout">Dropout</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Class Teacher</label>
                      <input
                        type="text"
                        value={editForm.classTeacher || ''}
                        onChange={(e) => setEditForm({...editForm, classTeacher: e.target.value})}
                        placeholder="Class teacher name"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Mentor</label>
                      <input
                        type="text"
                        value={editForm.mentor || ''}
                        onChange={(e) => setEditForm({...editForm, mentor: e.target.value})}
                        placeholder="Mentor name"
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Academic Remarks</label>
                    <textarea
                      value={editForm.academicRemarks || ''}
                      onChange={(e) => setEditForm({...editForm, academicRemarks: e.target.value})}
                      placeholder="Enter academic remarks..."
                      rows="3"
                    />
                  </div>
                </div>
              )}

              {/* Financial Tab */}
              {activeTab === 'financial' && (
                <div className="tab-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fee Status</label>
                      <select
                        value={editForm.feeStatus || 'Pending'}
                        onChange={(e) => setEditForm({...editForm, feeStatus: e.target.value})}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Total Fees ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.totalFees || ''}
                        onChange={(e) => setEditForm({...editForm, totalFees: parseFloat(e.target.value) || 0})}
                        placeholder="Total fees amount"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Fees Paid ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.feesPaid || ''}
                        onChange={(e) => setEditForm({...editForm, feesPaid: parseFloat(e.target.value) || 0})}
                        placeholder="Fees paid amount"
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Payment Date</label>
                      <input
                        type="date"
                        value={editForm.lastFeePaymentDate || ''}
                        onChange={(e) => setEditForm({...editForm, lastFeePaymentDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="fee-summary">
                    <h4>Fee Summary</h4>
                    <div className="summary-row">
                      <span>Total Fees:</span>
                      <span>${editForm.totalFees || '0.00'}</span>
                    </div>
                    <div className="summary-row">
                      <span>Fees Paid:</span>
                      <span>${editForm.feesPaid || '0.00'}</span>
                    </div>
                    <div className="summary-row pending">
                      <span>Pending Fees:</span>
                      <span>${calculatePendingFees(editForm.totalFees, editForm.feesPaid).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="tab-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Documents Verified</label>
                      <div className="checkbox-group">
                        <input
                          type="checkbox"
                          checked={editForm.documentsVerified || false}
                          onChange={(e) => setEditForm({...editForm, documentsVerified: e.target.checked})}
                          id="documentsVerified"
                        />
                        <label htmlFor="documentsVerified">
                          All documents are verified
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>ID Card Number</label>
                      <input
                        type="text"
                        value={editForm.idCardNumber || ''}
                        onChange={(e) => setEditForm({...editForm, idCardNumber: e.target.value})}
                        placeholder="ID card number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Library Card Number</label>
                      <input
                        type="text"
                        value={editForm.libraryCardNumber || ''}
                        onChange={(e) => setEditForm({...editForm, libraryCardNumber: e.target.value})}
                        placeholder="Library card number"
                      />
                    </div>
                  </div>
                </div>
              )}

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

export default AdminDashboard;