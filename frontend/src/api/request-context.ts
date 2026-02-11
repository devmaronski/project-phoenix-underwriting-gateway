import { LoanReviewResponse } from '@/types/api.types';
import { FrontendError } from './errors';

/**
 * Extract request ID from successful API response.
 *
 * @param response - LoanReviewResponse from backend
 * @returns UUID request ID for debugging
 */
export function extractRequestIdFromResponse(response: LoanReviewResponse): string | undefined {
  return response.meta?.requestId;
}

/**
 * Extract request ID from normalized frontend error.
 *
 * @param error - FrontendError thrown by API layer
 * @returns UUID request ID for debugging, undefined if not available
 */
export function extractRequestIdFromError(error: FrontendError): string | undefined {
  return error.meta?.requestId;
}

/**
 * Format request ID with label for error UI display.
 *
 * @param requestId - UUID request ID
 * @returns Formatted string "Request ID: <uuid>" or empty string if no ID
 */
export function formatRequestIdForDisplay(requestId: string | undefined): string {
  return requestId ? `Request ID: ${requestId}` : '';
}
