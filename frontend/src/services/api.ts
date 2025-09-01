//   import axios from 'axios';

//   const api = axios.create({
//     baseURL: 'http://localhost:5000/api',
//   });

//   // Automatically add JWT to requests
//   api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   });

//   // Client: Get own portfolio data
//   export const getClientPortfolioData = () => api.get('/client_data');

//   // Admin: Get all portfolio records
//   export const getAllPortfolioRecords = () => api.get('/portfolio_records');

//   export const updatePortfolioRecord = (id:any, data:any) =>
//     api.put(`/api/portfolio-record/${id}`, data);

//   export const deletePortfolioRecord = (id:any) =>
//     api.delete(`/api/portfolio-record/${id}`);

//   // Upload CSV for client
//   export const uploadPortfolioCSV = (formData: FormData) =>
//     api.post('/api/upload-csv', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//   // Get system settings (admin)
//   export const getSystemSettings = () => api.get('/api/system-setting');

// // Fetch portfolio analytics
// export async function getPortfolioAnalytics(params?: {start_date?: string;end_date?: string;}) {
//   const response = await api.get("/portfolio/analytics",{params});
//   return response;
// }


import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import React from "react";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // needed for refresh token cookie
});

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401 and try refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Dynamically get AuthContext (hacky but works in axios file)
      const authContext: any = React.useContext(AuthContext);

      if (authContext?.refreshAccessToken) {
        const newToken = await authContext.refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest); // retry original request
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ----------------------
// Example service calls

export const getClientPortfolioData = () => api.get("/client_data");

export const getAllPortfolioRecords = () => api.get("/portfolio_records");

export const updatePortfolioRecord = (id: any, data: any) =>
  api.put(`/portfolio-record/${id}`, data);

export const deletePortfolioRecord = (id: any) =>
  api.delete(`/portfolio-record/${id}`);

export const uploadPortfolioCSV = (formData: FormData) =>
  api.post("/upload-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getSystemSettings = () => api.get("/system-setting");

export const getPortfolioAnalytics = async (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  const response = await api.get("/portfolio/analytics", { params });
  return response;
};

// --- User management ---
export const getAllUsers = () => api.get("/users");
export const resetUserPassword = (userId: number, newPassword: string) =>
  api.post(`/users/${userId}/reset-password`, { newPassword });
export const deactivateUser = (userId: number) =>
  api.post(`/users/${userId}/deactivate`);
export const deleteUser = (userId: number) =>
  api.delete(`/users/${userId}`);