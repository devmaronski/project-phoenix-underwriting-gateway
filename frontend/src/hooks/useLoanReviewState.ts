/**
 * Custom hook for managing loan review state.
 * In Phase 1, uses local state. Phase 2 replaces with TanStack Query.
 *
 * This hook demonstrates the pattern that will be used when switching
 * to real API calls, so the component interface remains stable.
 */

import { useState, useCallback, useEffect } from "react";
import {
  LoanReviewResponse,
  ErrorResponse,
  LoanReviewState,
} from "@/types/api.types";
import { MOCK_SCENARIOS } from "@/mocks/loan-review.mock";

export interface UseLoanReviewOptions {
  loanId: string | null;
  mockScenario?: keyof typeof MOCK_SCENARIOS;
  simulateDelay?: number; // ms, default 800
  simulateError?: boolean;
}

/**
 * Hook that manages loan review data fetching and state.
 *
 * @param options - Configuration for the hook
 * @returns LoanReviewState with data, error, loading state, and refetch
 *
 * @example
 * const { data, error, isLoading, refetch } = useLoanReviewState({
 *   loanId: "loan-123",
 *   mockScenario: "success"
 * });
 */
export function useLoanReviewState(
  options: UseLoanReviewOptions
): LoanReviewState {
  const {
    loanId,
    mockScenario = "success",
    simulateDelay = 800,
    simulateError = false,
  } = options;

  const [data, setData] = useState<LoanReviewResponse | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate data fetching
  const refetch = useCallback(() => {
    if (!loanId) {
      setData(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate network delay
    const timer = setTimeout(() => {
      if (simulateError) {
        // Simulate an error response
        const mockError = MOCK_SCENARIOS.loanNotFound();
        setError(mockError as ErrorResponse);
        setData(null);
      } else {
        // Fetch mock data based on scenario
        const scenarioFn =
          MOCK_SCENARIOS[
            mockScenario as keyof typeof MOCK_SCENARIOS
          ] as unknown as () => LoanReviewResponse | ErrorResponse;

        const result = scenarioFn();

        // Check if result is error or success
        if ("error" in result) {
          setError(result as ErrorResponse);
          setData(null);
        } else {
          setData(result as LoanReviewResponse);
          setError(null);
        }
      }

      setIsLoading(false);
    }, simulateDelay);

    return () => clearTimeout(timer);
  }, [loanId, mockScenario, simulateDelay, simulateError]);

  // Auto-fetch when loanId changes
  useEffect(() => {
    refetch();
  }, [loanId, refetch]);

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}
