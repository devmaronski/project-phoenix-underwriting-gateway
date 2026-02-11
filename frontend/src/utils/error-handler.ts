import type { ApiError } from '../api/client';

interface ErrorMessage {
  title: string;
  message: string;
  canRetry: boolean;
}

export function getErrorMessage(error: ApiError): ErrorMessage {
  switch (error.code) {
    case "NOT_FOUND":
      return {
        title: 'Loan Not Found',
        message: 'The requested loan could not be found. Please check the loan ID and try again.',
        canRetry: false,
      };

    case "LEGACY_DATA_CORRUPT":
      return {
        title: 'Data Error',
        message: 'The legacy loan data is corrupted or invalid. Please contact support for assistance.',
        canRetry: false,
      };

    case "AI_TIMEOUT":
      return {
        title: 'Service Temporarily Unavailable',
        message: 'The risk assessment service is currently unavailable. Please try again in a moment.',
        canRetry: true,
      };

    case "NETWORK_ERROR":
      return {
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        canRetry: true,
      };

    case "VALIDATION_FAILED":
      return {
        title: 'Invalid Request',
        message: error.message || 'The request contains invalid data. Please check your input.',
        canRetry: false,
      };

    case "INTERNAL_SERVER_ERROR":
      return {
        title: 'Server Error',
        message: 'An unexpected server error occurred. Our team has been notified. Please try again later.',
        canRetry: true,
      };

    default:
      return {
        title: 'Unknown Error',
        message: error.message || 'An unexpected error occurred. Please try again.',
        canRetry: true,
      };
  }
}
