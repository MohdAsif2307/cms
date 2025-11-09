import axios from "axios";
import { BASE_URL } from "../baseUrl";

// Create a custom Axios instance
const axiosWrapper = axios.create({
  baseURL: BASE_URL,
});

// Add response interceptor
axiosWrapper.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.data?.message === "Invalid or expired token" &&
      error.response?.data?.success === false &&
      error.response?.data?.data === null
    ) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

// Logging toggle: on if Vite dev OR if localStorage.AXIOS_DEBUG === '1'
const enableLogging = (() => {
  try {
    const devFlag = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
    const localFlag = typeof localStorage !== 'undefined' && localStorage.getItem('AXIOS_DEBUG') === '1';
    return devFlag || localFlag;
  } catch (e) {
    return false;
  }
})();

if (enableLogging) {
  // notify once
  // eslint-disable-next-line no-console
  console.debug('[AXIOS LOGGING] enabled');

  axiosWrapper.interceptors.request.use((config) => {
    try {
      // shallow clone body for safe logging
      const payload = config.data && typeof config.data === 'object' ? { ...config.data } : config.data;
      // eslint-disable-next-line no-console
      console.debug('[AXIOS REQUEST]', config.method?.toUpperCase(), (config.baseURL || '') + (config.url || ''), payload, config.headers);
    } catch (e) {
      // ignore
    }
    return config;
  }, (err) => Promise.reject(err));

  axiosWrapper.interceptors.response.use((resp) => {
    try {
      // eslint-disable-next-line no-console
      console.debug('[AXIOS RESPONSE]', resp.config.method?.toUpperCase(), (resp.config.baseURL || '') + (resp.config.url || ''), resp.status, resp.data);
    } catch (e) {
      // ignore
    }
    return resp;
  }, (err) => {
    try {
      // eslint-disable-next-line no-console
      console.debug('[AXIOS ERROR]', err.config?.method?.toUpperCase(), (err.config?.baseURL || '') + (err.config?.url || ''), err.response?.status, err.response?.data || err.message);
    } catch (e) {
      // ignore
    }
    return Promise.reject(err);
  });
}

export default axiosWrapper;
