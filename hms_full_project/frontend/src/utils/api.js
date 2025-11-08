import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: API_ROOT,
  headers: { 'Content-Type': 'application/json' }
});
// Allow sending cookies for SSO flows
instance.defaults.withCredentials = true;

instance.setToken = (token) => {
  if(token) instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  else delete instance.defaults.headers.common['Authorization'];
};

// set token from localStorage if present
const existing = localStorage.getItem('hms_token');
if(existing) instance.defaults.headers.common['Authorization'] = 'Bearer ' + existing;

export default instance;
