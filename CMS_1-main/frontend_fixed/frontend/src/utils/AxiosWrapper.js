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

export default axiosWrapper;
