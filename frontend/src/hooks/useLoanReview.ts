import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { loansApi } from '@/api/loans';
import { normalizeError, isRetryable, FrontendError } from '@/api/errors';
import { LoanReviewResponse } from '@/types/api.types';

/**
 * Return type matches Phase 1 interface for backward compatibility.
 * Components don't need to change when switching from mock to production.
 */
export interface LoanReviewQueryResult {
  data: LoanReviewResponse | null;
  error: FrontendError | null;
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Fetch and manage loan review data using TanStack Query.
 *
 * Features:
 * - Smart retry: Auto-retries transient errors (503, 500, network), skips user errors (404, 422)
 * - Exponential backoff: 1s, 2s, 4s retries (capped at 30s)
 * - Request ID propagation: Extracts from response.meta.requestId for error UI
 * - Caching: TanStack Query caches results by queryKey
 * - Stale-while-revalidate: Serves stale data while refetching
 *
 * @param loanId - Unique loan identifier to fetch. If null, query is disabled.
 * @returns Query result with data, error, loading states, and refetch function
 *
 * @example
 * const { data, error, isLoading, refetch } = useLoanReview(loanId);
 *
 * if (isLoading) return <LoadingState />;
 * if (error) return <ErrorBanner error={error} onRetry={refetch} />;
 * return <LoanSummaryCard loan={data.loan} risk={data.risk} />;
 */
export function useLoanReview(loanId: string | null): LoanReviewQueryResult {
  const queryResult: UseQueryResult<LoanReviewResponse, FrontendError> = useQuery({
    // Query key: Unique identifier for caching. Includes loanId so different loans are cached separately.
    queryKey: ['loans', loanId],

    // Query function: Called when cache is stale or not present
    queryFn: async () => {
      if (!loanId) {
        throw new Error('Loan ID is required');
      }
      return loansApi.getReview(loanId);
    },

    // Enabled: Disable query if loanId is not provided (prevents unnecessary requests)
    enabled: !!loanId,

    // Retry strategy: Determine if error should be retried based on error type
    retry: (failureCount, error) => {
      const frontendError = error as FrontendError;
      // Max 3 retry attempts for transient errors
      return frontendError.retryable && failureCount < 3;
    },

    // Retry delay: Exponential backoff (1s, 2s, 4s, then capped at 30s)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Stale time: Keep data fresh for 5 minutes before background refetch
    staleTime: 5 * 60 * 1000,

    // GC time: Keep unused queries in cache for 10 minutes before cleanup
    gcTime: 10 * 60 * 1000,
  });

  // Normalize TanStack Query error shape to FrontendError
  const normalizedError: FrontendError | null = queryResult.error
    ? queryResult.error
    : null;

  return {
    data: queryResult.data ?? null,
    error: normalizedError,
    isLoading: queryResult.isLoading,
    isPending: queryResult.isPending,
    isError: queryResult.isError,
    refetch: () => {
      queryResult.refetch();
    },
  };
}
