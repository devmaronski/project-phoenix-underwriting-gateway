import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LoanReviewResponse, ErrorResponse } from '@/types/api.types';

// Axios instance configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s timeout for slow backends
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add headers, logging (if needed)
apiClient.interceptors.request.use(
  (config) => {
    // Optionally add auth headers here if needed in future
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Normalize errors for consistent handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<LoanReviewResponse>) => response,
  (error: AxiosError<ErrorResponse>) => {
    // Let error adapter handle normalization
    return Promise.reject(error);
  }
);

export default apiClient;
