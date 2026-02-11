import { apiClient } from './client';
import type { LoanReviewResponse } from '../types/api.types';

export const loansApi = {
  /**
   * Fetch loan review data including risk assessment
   * @param loanId - The unique identifier for the loan
   * @returns Promise resolving to loan review data
   * @throws ApiError when request fails
   */
  async getReview(loanId: string): Promise<LoanReviewResponse> {
    const response = await apiClient.get<LoanReviewResponse>(
      `/loans/${encodeURIComponent(loanId)}`
    );
    return response.data;
  }
};

export default loansApi;
