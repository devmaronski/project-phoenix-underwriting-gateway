import { AxiosError } from 'axios';
import { ErrorCode, ErrorResponse } from '@/types/api.types';

/**
 * Normalized error shape for frontend consumption.
 * Combines HTTP status, backend error code, and user-facing message.
 */
export interface FrontendError {
  code: ErrorCode | string;
  message: string; // User-friendly message
  retryable: boolean;
  meta: {
    requestId?: string;
    originalMessage?: string; // Backend error message for logging
  };
}

/**
 * Determine if error is retryable based on HTTP status and error code.
 * Transient errors (503, 500, network) are retryable.
 * User errors (400, 404, 422) are not.
 */
export function isRetryable(error: AxiosError<ErrorResponse>): boolean {
  if (!error.response) {
    // Network error, timeout, etc. → retryable
    return true;
  }

  const status = error.response.status;
  const backendCode = error.response.data?.error?.code;

  // User errors: never retry
  if (status === 400 || status === 404 || status === 422) {
    return false;
  }

  // Validation errors: never retry
  if (backendCode === ErrorCode.LEGACY_DATA_CORRUPT || backendCode === ErrorCode.VALIDATION_FAILED) {
    return false;
  }

  // Server errors + timeouts: always retry
  if (status >= 500 || status === 408) {
    return true;
  }

  // Network errors: retry
  if (!error.response) {
    return true;
  }

  // Default: don't retry (defensive)
  return false;
}

/**
 * Normalize AxiosError to FrontendError with user-friendly messaging.
 * Extracts backend error code, HTTP status, and requestId from response metadata.
 */
export function normalizeError(
  error: AxiosError<ErrorResponse> | Error
): FrontendError {
  // Error mapping table (shared for both branches)
  const errorMapping: Record<number | string, { code: ErrorCode | string; message: string }> = {
    400: {
      code: ErrorCode.VALIDATION_FAILED,
      message: 'Invalid request. Please check your input.',
    },
    404: {
      code: ErrorCode.NOT_FOUND,
      message: 'Loan not found. Please check the loan ID and try again.',
    },
    422: {
      code: ErrorCode.LEGACY_DATA_CORRUPT,
      message:
        'Loan data is unavailable or corrupted. Please contact support with the request ID below.',
    },
    408: {
      code: ErrorCode.AI_TIMEOUT,
      message: 'Request timed out. The risk service is taking too long. Please retry.',
    },
    503: {
      code: ErrorCode.RISK_SERVICE_DOWN,
      message: 'Risk service is currently unavailable. Please retry in a moment.',
    },
    500: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error. Our team has been notified. Please retry.',
    },
    [ErrorCode.NOT_FOUND]: {
      code: ErrorCode.NOT_FOUND,
      message: 'Loan not found. Please check the loan ID and try again.',
    },
    [ErrorCode.VALIDATION_FAILED]: {
      code: ErrorCode.VALIDATION_FAILED,
      message: 'Invalid request. Please check your input.',
    },
    [ErrorCode.LEGACY_DATA_CORRUPT]: {
      code: ErrorCode.LEGACY_DATA_CORRUPT,
      message:
        'Loan data is unavailable or corrupted. Please contact support with the request ID below.',
    },
    [ErrorCode.AI_TIMEOUT]: {
      code: ErrorCode.AI_TIMEOUT,
      message: 'Risk service timed out. Please retry in a moment.',
    },
    [ErrorCode.RISK_SERVICE_DOWN]: {
      code: ErrorCode.RISK_SERVICE_DOWN,
      message: 'Risk service is currently unavailable. Please retry in a moment.',
    },
    [ErrorCode.INTERNAL_SERVER_ERROR]: {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error. Our team has been notified. Please retry.',
    },
    [ErrorCode.NETWORK_ERROR]: {
      code: ErrorCode.NETWORK_ERROR,
      message: 'Network connection error. Please check your internet and retry.',
    },
  };

  // Handle non-Axios errors (network errors, timeouts, etc.)
  // Check if it's an AxiosError-like object (duck typing for tests)
  const possibleAxiosError = error as any;
  if (possibleAxiosError.response?.status) {
    // Treat as AxiosError
    const status = possibleAxiosError.response.status;
    const backendError = possibleAxiosError.response.data?.error;
    const requestId = possibleAxiosError.response.data?.meta?.requestId;
    
    const mappingKey = backendError?.code || status;
    const mapped = mappingKey !== undefined ? errorMapping[mappingKey] : undefined;
    
    if (mapped) {
      return {
        code: mapped.code,
        message: mapped.message,
        retryable: isRetryable(possibleAxiosError as AxiosError<ErrorResponse>),
        meta: {
          requestId,
          originalMessage: backendError?.message,
        },
      };
    }
    
    // Fallback for unmapped status codes with response
    return {
      code: 'UNKNOWN_ERROR',
      message:
        'An unexpected error occurred. Please try again or contact support with the request ID below.',
      retryable: isRetryable(possibleAxiosError as AxiosError<ErrorResponse>),
      meta: {
        requestId,
        originalMessage: backendError?.message || error.message,
      },
    };
  }
  
  // Network error (no response at all)
  return {
    code: ErrorCode.NETWORK_ERROR,
    message: 'Network connection error. Please check your internet and retry.',
    retryable: true,
    meta: {
      originalMessage: error.message,
    },
  };
}
