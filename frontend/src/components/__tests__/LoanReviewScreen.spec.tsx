/**
 * Tests for LoanReviewScreen component.
 */

import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoanReviewScreen } from '@/components/LoanReviewScreen';
import { useLoanReview } from '@/hooks/useLoanReview';
import type { LoanReviewResponse } from '@/types/api.types';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ApiError } from '@/api/client';

vi.mock('@/hooks/useLoanReview', () => ({
  useLoanReview: vi.fn()
}));

const mockUseLoanReview = vi.mocked(useLoanReview);

const mockData: LoanReviewResponse = {
  loan: {
    id: 'loan-123',
    borrower_name: 'Jane Doe',
    loan_amount_dollars: 250000,
    issued_date: '2025-01-01T00:00:00Z',
    interest_rate_percent: 5.5,
    term_months: 360
  },
  risk: {
    score: 85,
    topReasons: ['High debt-to-income ratio', 'Recent inquiry', 'Low savings'],
    allReasons: ['High debt-to-income ratio', 'Recent inquiry', 'Low savings']
  },
  meta: {
    requestId: 'req-123'
  }
};

const createState = (
  overrides: Partial<UseQueryResult<LoanReviewResponse, ApiError>> = {}
) =>
  ({
    data: undefined,
    error: null,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides
  }) as UseQueryResult<LoanReviewResponse, ApiError>;

describe('LoanReviewScreen', () => {
  beforeEach(() => {
    mockUseLoanReview.mockReset();
  });

  it('should show empty state when no loan ID provided', () => {
    mockUseLoanReview.mockReturnValue(createState());

    render(<LoanReviewScreen loanId={null} />);

    expect(
      screen.getByText(/Enter a loan ID to view details/i)
    ).toBeInTheDocument();
  });

  it('should render loading state', () => {
    mockUseLoanReview.mockReturnValue(
      createState({
        isLoading: true
      })
    );

    render(<LoanReviewScreen loanId="loan-123" />);

    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('should render error banner on error', () => {
    mockUseLoanReview.mockReturnValue(
      createState({
        isError: true,
        error: { code: 'NOT_FOUND', message: 'Loan not found' }
      })
    );

    render(<LoanReviewScreen loanId="loan-404" />);

    expect(screen.getByText('Loan Not Found')).toBeInTheDocument();
  });

  it('should render loan summary and risk score cards when data is available', () => {
    mockUseLoanReview.mockReturnValue(
      createState({
        data: mockData
      })
    );

    render(<LoanReviewScreen loanId="loan-123" />);

    expect(screen.getByText('Loan Details')).toBeInTheDocument();
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText(/Request ID: req-123/i)).toBeInTheDocument();
  });
});
