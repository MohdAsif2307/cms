// Load env defaults
process.env.HMS_FRONTEND_URL = process.env.HMS_FRONTEND_URL || 'http://localhost:5173'; // HMS frontend
process.env.HMS_API_URL = process.env.HMS_API_URL || 'http://localhost:5001'; // HMS API
process.env.CMS_API_URL = process.env.CMS_API_URL || 'http://localhost:4000'; // CMS API
process.env.FRONTEND_URL = process.env.FRONTEND_URL || process.env.HMS_FRONTEND_URL; // For CMS SSO mock

// Reuse existing test script
require('./test-sso-flow.js');