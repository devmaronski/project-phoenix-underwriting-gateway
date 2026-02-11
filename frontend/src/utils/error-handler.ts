/**
 * Error handling utilities for user-friendly error messages.
 * Maps backend error codes to messages and determines retry eligibility.
 */

import { ErrorCode, ErrorResponse } from "@/types/api.types";

export interface UserFriendlyError {
  title: string;
  message: string;
  canRetry: boolean;
  requestId: string;
}

/**
 * Maps backend error codes to user-friendly messages and retry logic.
 */
const ERROR_MESSAGES: Record<string, UserFriendlyError> = {
  [ErrorCode.NOT_FOUND]: {
    title: "Loan Not Found",
    message: "The loan ID does not exist. Please check and try again.",
    canRetry: false,
    requestId: "",
  },
  [ErrorCode.VALIDATION_FAILED]: {
    title: "Invalid Data",
    message:
      "The loan data is invalid. Please contact support with the request ID.",
    canRetry: false,
    requestId: "",
  },
  [ErrorCode.LEGACY_DATA_CORRUPT]: {
    title: "Data Error",
    message:
      "The loan record is corrupted in our system. Please contact support.",
    canRetry: false,
    requestId: "",
  },
  [ErrorCode.AI_TIMEOUT]: {
    title: "Service Timeout",
    message: "The risk assessment service is taking too long. Please retry.",
    canRetry: true,
    requestId: "",
  },
  [ErrorCode.RISK_SERVICE_DOWN]: {
    title: "Service Unavailable",
    message: "The risk service is currently offline. Please try again later.",
    canRetry: true,
    requestId: "",
  },
  [ErrorCode.NETWORK_ERROR]: {
    title: "Network Error",
    message:
      "Unable to reach the server. Check your connection and retry.",
    canRetry: true,
    requestId: "",
  },
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    title: "Server Error",
    message: "Something went wrong on the server. Please try again later.",
    canRetry: true,
    requestId: "",
  },
};

/**
 * Converts backend error response to user-friendly error object.
 *
 * @param error - Backend error response
 * @returns User-friendly error with message, retry capability, and requestId
 */
export function getUserFriendlyError(error: ErrorResponse): UserFriendlyError {
  const template =
    ERROR_MESSAGES[error.error.code] ||
    ERROR_MESSAGES[ErrorCode.INTERNAL_SERVER_ERROR];

  return {
    ...template,
    requestId: error.meta.requestId,
  };
}

/**
 * Determines if an error is retryable based on error code.
 */
export function isRetryableError(errorCode: string): boolean {
  const nonRetryableCodes = [
    ErrorCode.NOT_FOUND,
    ErrorCode.VALIDATION_FAILED,
    ErrorCode.LEGACY_DATA_CORRUPT,
  ];
  return !nonRetryableCodes.includes(errorCode as ErrorCode);
}
