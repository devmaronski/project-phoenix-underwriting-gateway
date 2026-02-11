/**
 * Tests for useLoanReviewState hook.
 * Covers: loading, success, error, refetch scenarios.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useLoanReviewState } from '@/hooks/useLoanReviewState';

describe('useLoanReviewState', () => {
  it('should initialize with null data and loading false', () => {
    const { result } = renderHook(() => useLoanReviewState({ loanId: null }));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should load data successfully', async () => {
    const { result } = renderHook(() =>
      useLoanReviewState({
        loanId: 'loan-123',
        mockScenario: 'success',
        simulateDelay: 50
      })
    );

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.risk.score).toBe(72);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() =>
      useLoanReviewState({
        loanId: 'loan-123',
        mockScenario: 'loanNotFound',
        simulateDelay: 50
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.error.code).toBe('NOT_FOUND');
  });

  it('should refetch on demand', async () => {
    const { result } = renderHook(() =>
      useLoanReviewState({
        loanId: 'loan-123',
        mockScenario: 'success',
        simulateDelay: 50
      })
    );

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });

    // Just verify refetch works without error
    await act(async () => {
      result.current.refetch();
    });

    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).not.toBeNull();
  });

  it('should handle loanId changes', async () => {
    const { result, rerender } = renderHook(
      ({ loanId }) =>
        useLoanReviewState({
          loanId,
          mockScenario: 'success',
          simulateDelay: 50
        }),
      { initialProps: { loanId: 'loan-123' } }
    );

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });

    // Change loanId
    await act(async () => {
      rerender({ loanId: 'loan-456' });
    });

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });
  });

  it('should return to empty state when loanId is cleared', async () => {
    const { result, rerender } = renderHook(
      ({ loanId }: { loanId: string | null }) =>
        useLoanReviewState({
          loanId,
          mockScenario: 'success',
          simulateDelay: 50
        }),
      { initialProps: { loanId: 'loan-123' as string | null } }
    );

    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
    });

    // Clear loanId
    await act(async () => {
      rerender({ loanId: null });
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should support different mock scenarios', async () => {
    const scenarios: Array<
      | 'success'
      | 'lowRisk'
      | 'mediumRisk'
      | 'highRisk'
      | 'loanNotFound'
      | 'aiTimeout'
    > = ['lowRisk', 'mediumRisk', 'highRisk', 'success'];

    for (const scenario of scenarios) {
      const { result } = renderHook(() =>
        useLoanReviewState({
          loanId: 'loan-123',
          mockScenario: scenario,
          simulateDelay: 50
        })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).not.toBeNull();
      expect(result.current.error).toBeNull();
    }
  });
});
