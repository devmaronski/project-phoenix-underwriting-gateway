import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { loansApi } from '../api/loans';
import type { LoanReviewResponse } from '../types/api.types';
import type { ApiError } from '../api/client';

export function useLoanReview(
  loanId: string | null
): UseQueryResult<LoanReviewResponse, ApiError> {
  const isTest = import.meta.env.MODE === 'test';

  return useQuery<LoanReviewResponse, ApiError>({
    queryKey: ['loans', loanId],
    queryFn: () => {
      if (!loanId) {
        throw new Error('Loan ID is required');
      }
      return loansApi.getReview(loanId);
    },
    enabled: !!loanId && loanId.trim() !== '',
    retry: (failureCount, error) => {
      if (isTest) {
        return false;
      }
      // Don't retry on client errors
      if (error.code === 'NOT_FOUND' || error.code === 'LEGACY_DATA_CORRUPT') {
        return false;
      }
      // Retry transient errors up to 3 times
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) =>
      isTest ? 0 : Math.min(1000 * 2 ** attemptIndex, 30000)
  });
}
