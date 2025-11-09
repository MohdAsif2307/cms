require('dotenv').config();
const axios = require('axios');

// Configuration
const CMS_API = process.env.CMS_API_URL || 'http://localhost:4000';

async function main() {
  try {
    // 1. First login as faculty
    console.log('Logging in as faculty...');
    const loginResp = await axios.post(`${CMS_API}/api/faculty/login`, {
      email: 'faculty1@college.edu',
      password: 'faculty123'
    });

    if (!loginResp.data?.data?.token) {
      throw new Error('Login failed - no token');
    }

    const token = loginResp.data.data.token;
    console.log('Got token:', token);

    // 2. Try to list students
    console.log('\nTrying to list students...');
    const studentsResp = await axios.get(`${CMS_API}/api/student`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-user-type': 'faculty'
      }
    });

    console.log('Response:', studentsResp.data);

  } catch (err) {
    if (err.response) {
      console.error('Request failed:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    process.exit(1);
  }
}

main();