import api from './client.js';

export const login = async (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = async (data) => {
  return api.post('/auth/register', data);
};

export const logout = async () => {
  return api.post('/auth/logout');
};

export const getMe = async () => {
  return api.get('/auth/me');
};
