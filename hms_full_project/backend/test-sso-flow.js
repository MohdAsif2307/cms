require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Load frontend URLs from env
const HMS_FRONTEND_URL = process.env.HMS_FRONTEND_URL || 'http://localhost:5173';

// Utility to test HMS SSO accept endpoint
async function testSsoAccept(hmsApi, transfer) {
  const acceptResp = await axios.get(`${hmsApi}/api/sso/accept?transfer=${transfer}`, {
    maxRedirects: 0, // don't follow redirects, just check if we get 302
    validateStatus: (status) => true // don't throw on any status
  });
  
  if (acceptResp.status === 302) {
    console.log('✅ HMS accept succeeded with redirect to:', acceptResp.headers.location);
    
    // Cookie should be set in response
    const cookies = acceptResp.headers['set-cookie'];
    if (cookies && cookies.some(function(c) { return c.startsWith('hms_token='); })) {
      console.log('✅ HMS token cookie set');
    } else {
      console.warn('⚠️ No HMS token cookie set');
    }
  } else {
    console.warn('⚠️ HMS accept did not redirect:', acceptResp.status);
  }
  return acceptResp;
}

// Test both student and faculty SSO flows
async function main() {
  const CMS_API = process.env.CMS_API_URL || 'http://localhost:4000';
  const HMS_API = process.env.HMS_API_URL || 'http://localhost:5001';
  
  // 1. Create a test faculty with hostel admin designation in CMS
  console.log('\nTesting faculty SSO flow:');
  try {
    const facultyLogin = await axios.post(`${CMS_API}/api/faculty/login`, {
      email: 'faculty1@college.edu',
      password: 'faculty123'
    });
    
    if (!facultyLogin.data?.data?.token) {
      throw new Error('Faculty login failed');
    }
    // Use token from data wrapper
    facultyLogin.data.token = facultyLogin.data.data.token;
    console.log('✅ Faculty login successful');
    
    // Test SSO redirect
    const ssoResp = await axios.post(
      `${CMS_API}/api/sso/redirect`,
      {},
      { headers: { Authorization: `Bearer ${facultyLogin.data.token}` }}
    );
    
    if (!ssoResp.data?.redirectUrl) {
      throw new Error('SSO redirect failed');
    }
    console.log('✅ Got SSO redirect URL:', ssoResp.data.redirectUrl);
    
    // Extract transfer token
    const transfer = new URL(ssoResp.data.redirectUrl).searchParams.get('transfer');
    if (!transfer) throw new Error('No transfer token in redirect URL');
    
    // Test HMS SSO accept
    await testSsoAccept(HMS_API, transfer);
    
  } catch (err) {
    console.error('❌ Faculty SSO failed:', err.message);
  }
  
  // 2. Test student SSO flow
  console.log('\nTesting student SSO flow:');
  try {
    const studentLogin = await axios.post(`${CMS_API}/api/student/login`, {
      email: 'student1@college.edu',
      password: 'student123'
    });
    
    if (!studentLogin.data?.data?.token) {
      throw new Error('Student login failed');
    }
    // Use token from data wrapper
    studentLogin.data.token = studentLogin.data.data.token;
    console.log('✅ Student login successful');
    
    // Test SSO redirect
    const ssoResp = await axios.post(
      `${CMS_API}/api/sso/redirect`,
      {},
      { headers: { Authorization: `Bearer ${studentLogin.data.token}` }}
    );
    
    if (!ssoResp.data?.redirectUrl) {
      throw new Error('SSO redirect failed');
    }
    console.log('✅ Got SSO redirect URL:', ssoResp.data.redirectUrl);
    
    // Extract transfer token
    const transfer = new URL(ssoResp.data.redirectUrl).searchParams.get('transfer');
    if (!transfer) throw new Error('No transfer token in redirect URL');
    
    // Test HMS SSO accept
    await testSsoAccept(HMS_API, transfer);
    
  } catch (err) {
    console.error('❌ Student SSO failed:', err.message);
  }
}

main().catch(console.error);