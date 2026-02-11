import axios, { AxiosError, AxiosInstance } from 'axios';

/**
 * Resolve API origin safely.
 * - In production: VITE_API_URL MUST exist.
 * - In development: fallback to localhost.
 */
const API_ORIGIN =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:3000' : undefined);

if (!API_ORIGIN) {
  throw new Error(
    'VITE_API_URL is missing. Ensure it is injected at build time.'
  );
}

/**
 * Create Axios instance
 * We append `/api` here so VITE_API_URL should NOT include `/api`
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface ApiError {
  code: string;
  message: string;
  statusCode?: number;
  requestId?: string;
}

/**
 * Global response error interceptor
 */
apiClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{
      error?: { code?: string; message?: string };
      meta?: { requestId?: string };
    }>
  ) => {
    const apiError: ApiError = {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred'
    };

    if (error.response) {
      const { data, status } = error.response;

      apiError.statusCode = status;
      apiError.code = data?.error?.code || mapStatusToCode(status);
      apiError.message = data?.error?.message || error.message;
      apiError.requestId = data?.meta?.requestId;
    } else if (error.request) {
      apiError.code = 'NETWORK_ERROR';
      apiError.message = 'Network error. Please check your connection.';
    } else {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

/**
 * Map HTTP status to domain error codes
 */
function mapStatusToCode(status: number): string {
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 422) return 'VALIDATION_FAILED';
  if (status === 503) return 'AI_TIMEOUT';
  if (status >= 500) return 'INTERNAL_SERVER_ERROR';
  return 'UNKNOWN_ERROR';
}

export default apiClient;
