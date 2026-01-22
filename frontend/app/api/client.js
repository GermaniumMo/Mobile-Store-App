import axios from 'axios';
import Constants from 'expo-constants';
import { getItem, removeItem } from '../utils/storage';

// Get API URL from app.json or use IP as fallback
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;


console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  async (error) => {
    console.log('API Error Details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      url: error.config?.url,
    });
    if (error.response?.status === 401) {
      await removeItem('token');
      await removeItem('user');
      await removeItem('role');
    }
    return Promise.reject(error);
  }
);

export default api;
