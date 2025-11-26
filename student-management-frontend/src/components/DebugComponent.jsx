// src/components/DebugComponent.jsx
import React, { useEffect, useState } from 'react';
import { debugAPI, adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const DebugComponent = () => {
  const navigate = useNavigate();
  const [debugInfo, setDebugInfo] = useState(null);
  const [adminTest, setAdminTest] = useState(null);
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    testAll();
  }, []);

  const testAll = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🧪 Starting comprehensive debug...');
      
      // Test 1: Debug auth endpoint
      console.log('1. Testing /api/debug/auth...');
      const authResponse = await debugAPI.testAuth();
      console.log('🔍 Auth debug result:', authResponse.data);
      setDebugInfo(authResponse.data);
      
      // Test 2: Test admin endpoint
      console.log('2. Testing /api/debug/admin-test...');
      const adminResponse = await debugAPI.testAdmin();
      console.log('🔍 Admin test result:', adminResponse.data);
      setAdminTest(adminResponse.data);
      
      // Test 3: Try actual admin endpoint
      console.log('3. Testing /api/admin/students...');
      const studentsResponse = await adminAPI.getAllStudents();
      console.log('✅ Students result:', studentsResponse.data);
      setStudents(studentsResponse.data);
      
    } catch (error) {
      console.error('❌ Debug test failed:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      setError(`Error: ${error.response?.status} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🔍 Debug Dashboard</h1>
        <div>
          <button 
            onClick={testAll} 
            style={{ marginRight: '10px', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Run Tests'}
          </button>
          <button 
            onClick={handleLogout}
            style={{ padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Current Auth State */}
      <div style={{ marginBottom: '20px', padding: '15px', background: 'white', borderRadius: '5px' }}>
        <h3>🔐 Current Authentication State</h3>
        <div>
          <strong>Token:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}
        </div>
        <div>
          <strong>Role:</strong> {localStorage.getItem('role') || 'None'}
        </div>
        <div>
          <strong>Token Preview:</strong> {localStorage.getItem('token') ? 
            localStorage.getItem('token').substring(0, 50) + '...' : 'No token'}
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Authentication Debug */}
        <div style={{ padding: '15px', background: 'white', borderRadius: '5px' }}>
          <h3>1. Authentication Debug</h3>
          {debugInfo ? (
            <pre style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          ) : (
            <p>No data yet. Click "Run Tests"</p>
          )}
        </div>

        {/* Admin Test */}
        <div style={{ padding: '15px', background: 'white', borderRadius: '5px' }}>
          <h3>2. Admin Test</h3>
          {adminTest ? (
            <pre style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
              {JSON.stringify(adminTest, null, 2)}
            </pre>
          ) : (
            <p>No data yet. Click "Run Tests"</p>
          )}
        </div>

        {/* Students Data */}
        <div style={{ padding: '15px', background: 'white', borderRadius: '5px', gridColumn: '1 / -1' }}>
          <h3>3. Students Data</h3>
          {students ? (
            <pre style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', overflow: 'auto', maxHeight: '400px' }}>
              {JSON.stringify(students, null, 2)}
            </pre>
          ) : (
            <p>No data yet. Click "Run Tests"</p>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ marginTop: '30px', padding: '15px', background: 'white', borderRadius: '5px' }}>
        <h3>🚀 Quick Navigation</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/admin')}
            style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Go to Admin Dashboard
          </button>
          <button 
            onClick={() => navigate('/student')}
            style={{ padding: '10px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Go to Student Dashboard
          </button>
          <button 
            onClick={() => navigate('/login')}
            style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugComponent;