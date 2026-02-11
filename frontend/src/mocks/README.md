# Mock Data Guide

## Overview

Phase 1 uses mock data to develop and test the UI without a backend. The mock data simulates realistic loan and risk scenarios for all testing needs.

## Mock Scenarios

### 1. Success (Default)

```typescript
MOCK_SCENARIOS.success();
```

- **Risk Score**: 72 (Medium-High Risk)
- **Top Reasons**: High debt-to-income ratio, Recent hard inquiry, Lower credit utilization
- **All Reasons**: + Limited credit history, Multiple recent inquiries
- **Use Case**: Happy path, test progressive disclosure

### 2. Low Risk

```typescript
MOCK_SCENARIOS.lowRisk();
```

- **Risk Score**: 25 (Low Risk)
- **Top Reasons**: Excellent payment history, High credit score
- **Use Case**: Test green color coding, minimal reasons

### 3. Medium Risk

```typescript
MOCK_SCENARIOS.mediumRisk();
```

- **Risk Score**: 45 (Medium Risk)
- **Top Reasons**: Moderate debt level, Few recent inquiries
- **Use Case**: Test yellow color coding

### 4. High Risk

```typescript
MOCK_SCENARIOS.highRisk();
```

- **Risk Score**: 85 (High Risk)
- **Top Reasons**: Very high debt-to-income, Multiple recent hard inquiries, Recent delinquency
- **All Reasons**: + Limited credit history, Recent collections
- **Use Case**: Test red color coding, full disclosure

### 5. Loan Not Found

```typescript
MOCK_SCENARIOS.loanNotFound();
```

- **Error Code**: NOT_FOUND
- **Message**: "Loan not found. Check the ID."
- **Retry**: ❌ No
- **Use Case**: Test 404 handling

### 6. AI Timeout

```typescript
MOCK_SCENARIOS.aiTimeout();
```

- **Error Code**: AI_TIMEOUT
- **Message**: "Risk service unavailable. Please retry."
- **Retry**: ✅ Yes
- **Use Case**: Test retryable error, timeout handling

### 7. Legacy Data Corrupt

```typescript
MOCK_SCENARIOS.legacyDataCorrupt();
```

- **Error Code**: LEGACY_DATA_CORRUPT
- **Message**: "Legacy data is corrupted. Please contact support."
- **Retry**: ❌ No
- **Use Case**: Test non-retryable error

### 8. Network Error

```typescript
MOCK_SCENARIOS.networkError();
```

- **Error Code**: NETWORK_ERROR
- **Message**: "Unable to reach the server."
- **Retry**: ✅ Yes
- **Use Case**: Test network failure recovery

## Using Mock Data in Components

### In App.tsx

```typescript
import { LoanReviewScreen } from "@/components/LoanReviewScreen";

export function App() {
  return (
    <LoanReviewScreen
      defaultLoanId="loan-123"
      mockScenario="success"  // Change this to test scenarios
    />
  );
}
```

### In Tests

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useLoanReviewState } from '@/hooks/useLoanReviewState';

it('should handle high risk', async () => {
  const { result } = renderHook(() =>
    useLoanReviewState({
      loanId: 'loan-123',
      mockScenario: 'highRisk', // Use specific scenario
      simulateDelay: 50
    })
  );

  await waitFor(() => {
    expect(result.current.data?.risk.score).toBe(85);
  });
});
```

## Creating Custom Mock Data

```typescript
import {
  createMockLoan,
  createMockRisk,
  createMockLoanReview
} from '@/mocks/loan-review.mock';

// Create loan with custom values
const customLoan = createMockLoan({
  borrower_name: 'Jane Smith',
  loan_amount_dollars: 500000,
  interest_rate_percent: 3.5,
  term_months: 240
});

// Create risk with custom values
const customRisk = createMockRisk({
  score: 50,
  topReasons: ['Custom reason 1', 'Custom reason 2'],
  allReasons: ['Custom reason 1', 'Custom reason 2', 'Custom reason 3']
});

// Create full review with custom data
const customReview = createMockLoanReview({
  loan: customLoan,
  risk: customRisk
});
```

## Simulating Delays

Control network delay simulation:

```typescript
useLoanReviewState({
  loanId: 'loan-123',
  mockScenario: 'success',
  simulateDelay: 1000 // 1 second delay (default: 800ms)
});
```

## Simulating Random Errors

Force error responses (useful for testing error handling):

```typescript
useLoanReviewState({
  loanId: 'loan-123',
  mockScenario: 'success',
  simulateError: true // Returns error instead of success
});
```

## Phase 2: Replacing Mock Data

When moving to real API calls (Phase 2):

1. Create `src/api/client.ts` – Axios HTTP client
2. Create `src/api/loans.ts` – Loan API endpoints
3. Update `useLoanReviewState` to use TanStack Query
4. Remove `simulateDelay` and `simulateError` parameters
5. Delete `src/mocks/` directory (move to `__tests__/mocks/` if needed)

The component interface stays the same:

```typescript
// Phase 1
const { data, error, isLoading, refetch } = useLoanReviewState({ loanId });

// Phase 2 (same interface)
const { data, error, isLoading, refetch } = useLoanReviewState({ loanId });
```

## Notes

- ✅ Mock data matches backend API contract exactly
- ✅ UUIDs regenerated for each request (different `requestId`)
- ✅ All error codes map to proper messages
- ✅ Retry eligibility follows backend logic
- ✅ Use `createMock*` functions for test data generation
