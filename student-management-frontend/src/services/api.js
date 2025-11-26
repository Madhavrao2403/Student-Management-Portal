import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (studentData) => api.post('/auth/register', studentData),
};

// Student API (for students to manage their own profile)
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (id, data) => api.put(`/students/${id}`, data),
  deleteProfile: (id) => api.delete(`/students/${id}`),
};

// Admin API (for admin to manage all students)
export const adminAPI = {
  getAllStudents: () => api.get('/admin/students'),
  getStudent: (id) => api.get(`/admin/students/${id}`),
  createStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
};

// Debug API (optional - remove in production)
export const debugAPI = {
  testAuth: () => api.get('/debug/auth'),
  testAdmin: () => api.get('/debug/admin-test'),
};

export const securityAPI = {
  getContext: () => api.get('/security/context'),
};

export default api;