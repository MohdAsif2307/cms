import axios from 'axios';
const hms = axios.create({ baseURL: process.env.REACT_APP_HMS_URL || 'http://localhost:5001' });
hms.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default hms;
