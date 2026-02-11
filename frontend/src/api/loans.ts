import { AxiosError } from 'axios';
import { apiClient } from './client';
import { normalizeError, FrontendError } from './errors';
import { LoanReviewResponse, ErrorResponse } from '@/types/api.types';

/**
 * Loan API service with typed methods for backend communication.
 * All errors thrown are normalized to FrontendError.
 */
export const loansApi = {
  /**
   * Fetch loan review (loan data + risk score) by loan ID.
   *
   * @param loanId - Unique loan identifier
   * @returns Promise resolving to loan review data with risk score
   * @throws FrontendError - Normalized error with user-friendly message
   *
   * @example
   * try {
   *   const review = await loansApi.getReview('loan-123');
   *   console.log(review.risk.score); // 72
   * } catch (error) {
   *   console.error(error.message); // "Loan not found..."
   * }
   */
  async getReview(loanId: string): Promise<LoanReviewResponse> {
    try {
      const response = await apiClient.get<LoanReviewResponse>(
        `/loans/${encodeURIComponent(loanId)}`
      );
      return response.data;
    } catch (error) {
      const normalized = normalizeError(error as AxiosError<ErrorResponse> | Error);
      throw normalized;
    }
  },
};

export default loansApi;
