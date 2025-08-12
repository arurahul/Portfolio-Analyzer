import axios from 'axios';

const api = axios.create({
   baseURL: 'http://localhost:5000/api',
});

// Automatically add JWT to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Client: Get own portfolio data
export const getClientPortfolioData = () => api.get('/client_data');

// Admin: Get all portfolio records
export const getAllPortfolioRecords = () => api.get('/portfolio_records');

// Upload CSV for client
export const uploadPortfolioCSV = (formData: FormData) =>
  api.post('/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// Get system settings (admin)
export const getSystemSettings = () => api.get('/system-setting');
