import axios from 'axios';
import Constants from 'expo-constants';
import { getItem, removeItem } from '../utils/storage';

// Get API URL from app.json
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// Replace localhost/127.0.0.1 with the host IP when running on a device/emulator
let resolvedBaseUrl = API_BASE_URL;
try {
  const debuggerHost = Constants.manifest?.debuggerHost || Constants.expoConfig?.hostUri;
  if (debuggerHost && (API_BASE_URL.includes('127.0.0.1') || API_BASE_URL.includes('localhost'))) {
    const host = debuggerHost.split(':')[0];
    resolvedBaseUrl = API_BASE_URL.replace('127.0.0.1', host).replace('localhost', host);
  }
} catch (e) {
  // ignore and use provided API_BASE_URL
}

console.log('API Base URL (resolved):', resolvedBaseUrl);

const api = axios.create({
  baseURL: resolvedBaseUrl,
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
