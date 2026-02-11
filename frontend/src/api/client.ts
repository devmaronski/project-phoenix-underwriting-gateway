import axios, { AxiosError, AxiosInstance } from 'axios';
import { ErrorCode } from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiError {
  code: string;
  message: string;
  statusCode?: number;
  requestId?: string;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error: { code: string; message: string }; meta?: { requestId: string } }>) => {
    const apiError: ApiError = {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
    };

    if (error.response) {
      // Server responded with error
      const { data, status } = error.response;
      
      apiError.statusCode = status;
      apiError.code = data?.error?.code || mapStatusToCode(status);
      apiError.message = data?.error?.message || error.message;
      apiError.requestId = data?.meta?.requestId;
    } else if (error.request) {
      // Request made but no response
      apiError.code = ErrorCode.NETWORK_ERROR;
      apiError.message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

function mapStatusToCode(status: number): string {
  if (status === 404) return ErrorCode.NOT_FOUND;
  if (status === 422) return ErrorCode.VALIDATION_FAILED;
  if (status === 503) return ErrorCode.AI_TIMEOUT;
  if (status >= 500) return ErrorCode.INTERNAL_SERVER_ERROR;
  return 'UNKNOWN_ERROR';
}

export default apiClient;
