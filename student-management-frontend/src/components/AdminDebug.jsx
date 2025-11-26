// src/components/AdminDebug.jsx
import React, { useEffect, useState } from 'react';
import { debugAPI, adminAPI } from '../services/api';

const AdminDebug = () => {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    testAdminAccess();
  }, []);

  const testAdminAccess = async () => {
    addLog('🧪 Starting admin access test...');
    
    try {
      // Test 1: Check current auth state
      addLog('1. Testing authentication state...');
      const authResponse = await debugAPI.testAuth();
      addLog(`✅ Auth state: ${JSON.stringify(authResponse.data)}`);
      
      // Test 2: Test admin-specific endpoint
      addLog('2. Testing admin endpoint access...');
      const adminResponse = await debugAPI.testAdmin();
      addLog(`✅ Admin test: ${JSON.stringify(adminResponse.data)}`);
      
      // Test 3: Try to fetch students (admin only)
      addLog('3. Testing students data access...');
      const studentsResponse = await adminAPI.getAllStudents();
      addLog(`✅ Students data: Received ${studentsResponse.data?.length || 0} students`);
      
      addLog('🎉 ALL ADMIN TESTS PASSED!');
      
    } catch (error) {
      addLog(`❌ Test failed: ${error.message}`);
      addLog(`Error details: ${JSON.stringify({
        status: error.response?.status,
        data: error.response?.data
      })}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔧 Admin Access Debug</h2>
      <button onClick={testAdminAccess} style={{ marginBottom: '20px', padding: '10px' }}>
        Run Admin Tests
      </button>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '12px',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        {logs.map((log, index) => (
          <div key={index} style={{ 
            marginBottom: '5px',
            color: log.includes('❌') ? '#dc3545' : log.includes('✅') ? '#28a745' : '#000'
          }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDebug;