import axios from 'axios';

const api = axios.create({
   baseURL: 'http://localhost:5000',
});

// Automatically add JWT to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getClientData = () => api.get('/client-data');
export const getSystemSettings = () => api.get('/system-settings');