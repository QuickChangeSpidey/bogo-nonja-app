import axios from 'axios';
import { Platform } from 'react-native';

// Define API base URL
export const API_BASE_URL = Platform.OS == "android" ? 'http://10.0.2.2:5000/api/':'http://localhost:5000/api/';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (For adding auth tokens)
apiClient.interceptors.request.use(
  async (config) => {
    const token = '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (For error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
