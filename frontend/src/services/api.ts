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

  export const updatePortfolioRecord = (id:any, data:any) =>
    api.put(`/api/portfolio-record/${id}`, data);

  export const deletePortfolioRecord = (id:any) =>
    api.delete(`/api/portfolio-record/${id}`);

  // Upload CSV for client
  export const uploadPortfolioCSV = (formData: FormData) =>
    api.post('/api/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  // Get system settings (admin)
  export const getSystemSettings = () => api.get('/api/system-setting');

// Fetch portfolio analytics
export async function getPortfolioAnalytics(params?: {start_date?: string;end_date?: string;}) {
  const response = await api.get("/portfolio/analytics",{params});
  return response;
}
