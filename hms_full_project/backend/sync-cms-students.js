require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import HMS models
const User = require('./models/User');
const HostelStudent = require('./models/HostelStudent');

// Configuration from env
const MONGO = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/hms';
const CMS_API = process.env.CMS_API_URL || 'http://localhost:4000';
const CMS_JWT_SECRET = process.env.CMS_JWT_SECRET || 'shared_secret_for_testing';

  // Helper to get admin token from CMS
async function getCmsAdminToken() {
  const url = `${CMS_API.replace(/\/$/, '')}/api/faculty/login`;
  console.log('Getting CMS admin token...');  try {
    const http = require('http');
    const https = require('https');
    const lib = url.startsWith('https:') ? https : http;
    
    const loginData = JSON.stringify({
      email: 'faculty1@college.edu',
      password: 'faculty123'
    });
    
    const response = await new Promise((resolve, reject) => {
      const req = lib.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginData)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });
    
    if (response.status !== 200) {
      throw new Error(`Admin login failed: ${response.status}`);
    }
    
    const parsed = JSON.parse(response.data);
    return parsed.token;
  } catch (err) {
    throw new Error(`Failed to get admin token: ${err.message}`);
  }
}

// Helper to fetch students from CMS
async function fetchCmsStudents() {
  // First get admin token
  const adminToken = await getCmsAdminToken();
  console.log('Got CMS admin token');
  
  // CMS uses /api/student for list endpoint
  const endpoints = [
    '/api/student',       // main student list endpoint
    '/api/student/all',   // fallback endpoint
    '/api/student/list'   // last resort
  ];
  
  for (const path of endpoints) {
    const url = `${CMS_API.replace(/\/$/, '')}${path}`;
    console.log('Trying CMS endpoint:', url);
    
    try {
      const http = require('http');
      const https = require('https');
      const lib = url.startsWith('https:') ? https : http;
      
      const response = await new Promise((resolve, reject) => {
        const req = lib.request(url, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'x-user-type': 'admin'
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data }));
        });
        req.on('error', reject);
        req.setTimeout(5000, () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
        req.end();
      });
      
      if (response.status !== 200) {
        console.warn(`Endpoint ${path} returned ${response.status}`);
        continue;
      }
      
      try {
        const parsed = JSON.parse(response.data);
        const students = parsed.students || parsed.data || parsed;
        if (Array.isArray(students) && students.length > 0) {
          console.log(`Found ${students.length} students via ${path}`);
          return students.filter(s => s && (s.email || s.enrollmentNo));
        }
      } catch (e) {
        console.warn(`Failed to parse response from ${path}:`, e.message);
      }
    } catch (err) {
      console.warn(`Failed to fetch from ${path}:`, err.message);
    }
  }
  
  throw new Error('Could not fetch students from any CMS endpoint');
}

// Synchronize a single student
async function syncStudent(cmsStudent) {
  try {
    const { _id: cmsId, email, name, enrollmentNo, branch } = cmsStudent;
    if (!email) {
      console.warn('Skipping student without email:', cmsId);
      return null;
    }

    // Find or create HMS User
    let user = await User.findOne({ email });
    if (!user) {
      // Create new HMS user account
      const tempPass = Math.random().toString(36).slice(-8);
      const hash = await bcrypt.hash(tempPass, 10);
      user = await User.create({
        name,
        email,
        passwordHash: hash,
        role: 'student',
      });
      console.log('Created HMS user for', email, '- temp password:', tempPass);
    } else {
      // Update existing user
      user.name = name;
      await user.save();
    }

    // Find or create HMS HostelStudent record
    let hostelStudent = await HostelStudent.findOne({ userId: user._id });
    if (!hostelStudent) {
      hostelStudent = await HostelStudent.create({
        userId: user._id,
        cmsId, // link to CMS student ID
        enrollmentNo,
        branch: branch?.name || null,
        status: 'pending', // requires hostel admin approval
      });
      console.log('Created HMS hostel record for', email);
    } else {
      // Update existing record
      hostelStudent.cmsId = cmsId;
      hostelStudent.enrollmentNo = enrollmentNo;
      hostelStudent.branch = branch?.name || hostelStudent.branch;
      await hostelStudent.save();
    }

    return { user, hostelStudent };
  } catch (err) {
    console.error('Failed to sync student:', err.message);
    return null;
  }
}

// Main sync function
async function main() {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB at', MONGO);

    console.log('Fetching students from CMS...');
    const students = await fetchCmsStudents();
    console.log('Found', students.length, 'students in CMS');

    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const student of students) {
      const result = await syncStudent(student);
      if (result) {
        if (result.user.isNew) created++;
        else updated++;
      } else failed++;
    }

    console.log('\nSync complete:');
    console.log('- Created:', created);
    console.log('- Updated:', updated);
    console.log('- Failed:', failed);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { syncStudent, fetchCmsStudents };
