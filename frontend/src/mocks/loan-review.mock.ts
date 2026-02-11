/**
 * Mock data generators for testing and development.
 * Provides realistic loan and risk data matching backend contracts.
 */

import {
  Loan,
  LoanReviewResponse,
  ErrorResponse,
  ErrorCode,
  Risk
} from '@/types/api.types';

// ─────────────────────────────────────────────────────
// MOCK LOAN DATA
// ─────────────────────────────────────────────────────

export function createMockLoan(overrides?: Partial<Loan>): Loan {
  return {
    id: 'loan-123',
    borrower_name: 'John Doe',
    loan_amount_dollars: 250000,
    issued_date: '2025-01-15T10:30:00Z',
    interest_rate_percent: 6.5,
    term_months: 360,
    ...overrides
  };
}

export function createMockRisk(overrides?: Partial<Risk>): Risk {
  return {
    score: 72,
    topReasons: [
      'High debt-to-income ratio',
      'Recent hard inquiry',
      'Lower credit utilization'
    ],
    allReasons: [
      'High debt-to-income ratio',
      'Recent hard inquiry',
      'Lower credit utilization',
      'Limited credit history',
      'Multiple recent inquiries'
    ],
    ...overrides
  };
}

export function createMockLoanReview(
  overrides?: Partial<LoanReviewResponse>
): LoanReviewResponse {
  return {
    loan: createMockLoan(),
    risk: createMockRisk(),
    meta: {
      requestId: crypto.randomUUID()
    },
    ...overrides
  };
}

// ─────────────────────────────────────────────────────
// MOCK ERROR RESPONSES
// ─────────────────────────────────────────────────────

export function createMockErrorResponse(
  code: ErrorCode | string = 'NOT_FOUND',
  message?: string
): ErrorResponse {
  const messages: Record<string, string> = {
    NOT_FOUND: 'Loan not found. Check the ID.',
    VALIDATION_FAILED: 'Invalid loan data provided.',
    LEGACY_DATA_CORRUPT: 'Legacy data is corrupted. Please contact support.',
    AI_TIMEOUT: 'Risk service unavailable. Please retry.',
    RISK_SERVICE_DOWN: 'Risk service is currently offline.',
    NETWORK_ERROR: 'Network error. Check your connection.',
    INTERNAL_SERVER_ERROR: 'Server error. Please try again later.'
  };

  return {
    error: {
      code,
      message: message || messages[code] || 'An unknown error occurred.'
    },
    meta: {
      requestId: crypto.randomUUID()
    }
  };
}

/**
 * Convert ErrorResponse to ApiError format for component tests.
 * This mimics what the axios interceptor does in client.ts.
 */
export function createMockApiError(
  code: ErrorCode | string = 'NOT_FOUND',
  message?: string
): import('../api/client').ApiError {
  const errorResponse = createMockErrorResponse(code, message);
  return {
    code: errorResponse.error.code,
    message: errorResponse.error.message,
    requestId: errorResponse.meta.requestId
  };
}

// ─────────────────────────────────────────────────────
// MOCK SCENARIOS
// ─────────────────────────────────────────────────────

export const MOCK_SCENARIOS = {
  success: (): LoanReviewResponse => createMockLoanReview(),

  lowRisk: (): LoanReviewResponse =>
    createMockLoanReview({
      risk: createMockRisk({
        score: 25,
        topReasons: ['Excellent payment history', 'High credit score'],
        allReasons: [
          'Excellent payment history',
          'High credit score',
          'Long credit history'
        ]
      })
    }),

  mediumRisk: (): LoanReviewResponse =>
    createMockLoanReview({
      risk: createMockRisk({
        score: 45,
        topReasons: ['Moderate debt level', 'Few recent inquiries'],
        allReasons: ['Moderate debt level', 'Few recent inquiries']
      })
    }),

  highRisk: (): LoanReviewResponse =>
    createMockLoanReview({
      risk: createMockRisk({
        score: 85,
        topReasons: [
          'Very high debt-to-income',
          'Multiple recent hard inquiries',
          'Recent delinquency'
        ],
        allReasons: [
          'Very high debt-to-income',
          'Multiple recent hard inquiries',
          'Recent delinquency',
          'Limited credit history',
          'Recent collections'
        ]
      })
    }),

  loanNotFound: (): ErrorResponse => createMockErrorResponse('NOT_FOUND'),

  legacyDataCorrupt: (): ErrorResponse =>
    createMockErrorResponse('LEGACY_DATA_CORRUPT'),

  aiTimeout: (): ErrorResponse => createMockErrorResponse('AI_TIMEOUT'),

  networkError: (): ErrorResponse =>
    createMockErrorResponse('NETWORK_ERROR', 'Unable to reach the server.')
};
