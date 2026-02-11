# Project Phoenix – Frontend README

## Overview

This is the **Phase 1: UI Skeleton** implementation of the Project Phoenix Loan Review Screen. The frontend displays loan details and risk assessments with progressive disclosure for detailed risk factors.

**Phase 1 Status**: Complete (mock data)  
**Phase 2 Status**: Complete (API integration with TanStack Query)  
**Phase 3**: Full end-to-end testing and error handling

---

## Stack & Tech Choices

### React 18 + Vite

- **Why**: Fast, modern dev experience with optimized build output
- **HMR**: Instant feedback during development
- **Build**: Lightning-fast production builds (<100ms)

### TypeScript (Strict Mode)

- **Why**: Catch errors at build time, not runtime
- **Config**: `noImplicitAny`, `strictNullChecks`, `noUnusedLocals` enabled
- **Zero `any` types**: Every value is explicitly typed

### Tailwind CSS + PostCSS

- **Why**: Utility-first, production-ready styling without custom CSS
- **No CSS-in-JS**: Faster builds, smaller bundle
- **Responsive**: Mobile-first design out of the box

### shadcn/ui

- **Why**: Copy-paste, headless components (Radix primitives)
- **Zero dependencies**: No component library lock-in
- **Customizable**: Tailwind-based, easy to override

### Vitest + React Testing Library

- **Why**: Fast unit/integration tests, behavior-driven
- **No implementation details**: Test what users see and interact with
- **Target**: 70%+ code coverage

---

## Project Structure

```
frontend/src/
├── api/                            # Phase 2: API client layer
│   ├── __tests__/
│   │   ├── mocks/
│   │   │   └── handlers.ts         # MSW handlers for tests
│   │   ├── setup.ts                # MSW server setup
│   │   ├── client.spec.ts          # API client tests
│   │   ├── errors.spec.ts          # Error normalization tests
│   │   └── loans.spec.ts           # Loans API tests
│   ├── client.ts                   # Axios HTTP client
│   ├── errors.ts                   # Error normalization layer
│   ├── loans.ts                    # Loan API endpoints
│   └── request-context.ts          # Request ID utilities
├── components/
│   ├── __tests__/                  # Component tests
│   │   ├── LoanReviewScreen.spec.tsx
│   │   ├── RiskScoreCard.spec.tsx
│   │   ├── ErrorBanner.spec.tsx
│   │   ├── LoadingState.spec.tsx
│   │   ├── DisclosurePanel.spec.tsx
│   │   └── LoanSummaryCard.spec.tsx
│   ├── ui/                         # shadcn/ui base components
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   └── button.tsx
│   ├── LoanReviewScreen.tsx        # Main orchestrator
│   ├── RiskScoreCard.tsx           # Risk display + disclosure
│   ├── DisclosurePanel.tsx         # Expandable reasons
│   ├── ErrorBanner.tsx             # Error UI + retry
│   ├── LoadingState.tsx            # Skeleton loaders
│   └── LoanSummaryCard.tsx         # Loan details
├── hooks/
│   ├── __tests__/
│   │   ├── useLoanReview.spec.ts   # Phase 2: TanStack Query hook tests
│   │   ├── useLoanReviewState.spec.ts
│   │   └── useDisclosure.spec.ts
│   ├── useLoanReview.ts            # Phase 2: TanStack Query hook
│   ├── useLoanReviewState.ts       # Phase 1: Mock state hook
│   └── useDisclosure.ts            # Expand/collapse logic
├── types/
│   └── api.types.ts                # API types + Zod schemas
├── utils/
│   ├── __tests__/
│   │   ├── error-handler.spec.ts
│   │   └── format.spec.ts
│   ├── error-handler.ts            # Error mapping + retry logic
│   └── format.ts                   # Date/currency formatting
├── mocks/
│   └── loan-review.mock.ts         # Mock data generators
├── App.tsx                         # Root component + QueryClientProvider
└── main.tsx                        # Entry point
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Server starts at `http://localhost:5173`

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage report
npm run test:coverage
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

### Linting & Formatting

```bash
npm run lint
npm run format:check
```

---

## Component Architecture

### Single Responsibility Principle

Each component has **one job**:

- **LoanReviewScreen**: Orchestration (state, routing, layout)
- **LoanSummaryCard**: Display loan information
- **RiskScoreCard**: Display risk score + toggle disclosure
- **DisclosurePanel**: Show additional reasons (hidden by default)
- **ErrorBanner**: Display errors + copy requestId + retry
- **LoadingState**: Skeleton loaders during fetch

### Data Flow (Phase 1 - Mock)

```
LoanReviewScreen
  ├─ useLoanReviewState (state management)
  │   └─ Mock data (MOCK_SCENARIOS)
  ├─ LoadingState (isLoading)
  ├─ ErrorBanner (error)
  └─ LoanSummaryCard + RiskScoreCard (data)
      ├─ useDisclosure (toggle) → DisclosurePanel
      └─ Child components (Card, Badge, Button from shadcn/ui)
```

### Prop Typing (No `any` Types)

Every component has explicit TypeScript interfaces:

```typescript
export interface LoanReviewScreenProps {
  defaultLoanId?: string;
  mockScenario?:
    | 'success'
    | 'lowRisk'
    | 'highRisk'
    | 'loanNotFound'
    | 'aiTimeout';
}

export function LoanReviewScreen(props: LoanReviewScreenProps) {
  // ...
}
```

---

## Testing Strategy

### Test Coverage Target: 70%+

**Phase 1 covers:**

- Hook tests (useLoanReviewState, useDisclosure)
- Utility tests (error mapping, formatting)
- Component tests (all UI components)
- Integration tests (LoanReviewScreen end-to-end)

### Running Tests

```bash
# Run once
npm run test

# Watch mode (auto-rerun on file change)
npm run test -- --watch

# Coverage report (HTML in coverage/ directory)
npm run test:coverage
```

---

## Mock Data & Testing Scenarios

### Available Scenarios

```typescript
export const MOCK_SCENARIOS = {
  success: () => ({ loan, risk: { score: 72 }, ... }),
  lowRisk: () => ({ loan, risk: { score: 25 }, ... }),
  mediumRisk: () => ({ loan, risk: { score: 45 }, ... }),
  highRisk: () => ({ loan, risk: { score: 85 }, ... }),
  loanNotFound: () => ({ error: NOT_FOUND, ... }),
  aiTimeout: () => ({ error: AI_TIMEOUT, ... }),
};
```

### Using Mock Scenarios

```typescript
// In development/testing:
<LoanReviewScreen
  defaultLoanId="loan-123"
  mockScenario="highRisk"  // See high-risk loan
/>
```

---

## Error Handling

### Error Codes & Messages

All errors map to user-friendly messages with request IDs for debugging.

| Code                | Retry? |
| ------------------- | ------ |
| NOT_FOUND           | ❌ No  |
| VALIDATION_FAILED   | ❌ No  |
| LEGACY_DATA_CORRUPT | ❌ No  |
| AI_TIMEOUT          | ✅ Yes |
| RISK_SERVICE_DOWN   | ✅ Yes |
| NETWORK_ERROR       | ✅ Yes |

### Request ID for Debugging

Every error includes a UUID `requestId` that users can copy and share with support.

---

## Risk Score Colors

| Score  | Level       | Color  |
| ------ | ----------- | ------ |
| 0–39   | Low Risk    | Green  |
| 40–69  | Medium Risk | Yellow |
| 70–100 | High Risk   | Red    |

---

## Environment Variables

Create a `.env.local` file (Phase 2):

```env
VITE_API_URL=http://localhost:3000/api
```

See `.env.example` for available variables.

---

## Type Safety Guarantees

✅ **Zero `any` types** – Every value is explicitly typed  
✅ **Strict null checks** – `null` and `undefined` caught at build time  
✅ **No unused variables** – `noUnusedLocals` enabled  
✅ **Runtime validation** – Zod schemas validate API responses

---

## Best Practices Applied

### Component Design

- ✅ Single responsibility per component
- ✅ Explicit prop interfaces
- ✅ No prop drilling (composition over context)
- ✅ Reusable utility components

### State Management

- ✅ Local state for simple UI state (`useDisclosure`)
- ✅ Mocked hook for data fetching (Phase 1)
- ✅ Ready for TanStack Query (Phase 2)

### Error Handling

- ✅ All error paths tested
- ✅ User-friendly messages
- ✅ Request ID for debugging
- ✅ Retry logic for transient errors

### Testing

- ✅ Unit tests (hooks, utilities)
- ✅ Integration tests (components)
- ✅ No implementation detail testing
- ✅ 70%+ code coverage

### Code Quality

- ✅ ESLint + Prettier for consistency
- ✅ Type safety throughout
- ✅ Clear variable naming
- ✅ Minimal comments (code is self-documenting)

---

## Next Steps (Phase 2)

- Implement `src/api/client.ts` (Axios HTTP client)
- Implement `src/api/loans.ts` (loan endpoints)
- Replace `useLoanReviewState` with TanStack Query hook
- Add retry logic and caching
- Wire real API calls

---

## Phase 2: API Client & TanStack Query Integration

### Overview

Phase 2 replaces the mock `useLoanReviewState` hook with production-ready API integration using TanStack Query. The implementation maintains full backwards compatibility with Phase 1 components.

### New Dependencies

- **@tanstack/react-query** – Server state management with caching and retry logic
- **axios** – HTTP client for backend communication
- **msw** – Mock Service Worker for realistic HTTP testing
- **@tanstack/react-query-devtools** – Dev tools for debugging queries

### API Client Architecture

#### 1. HTTP Client (`api/client.ts`)

Axios instance with:

- Base URL from environment variable (`VITE_API_URL`)
- 30-second timeout for slow backend operations
- Request/response interceptors for error handling

#### 2. Error Normalization (`api/errors.ts`)

Maps HTTP status codes and backend error codes to user-friendly messages:

```typescript
interface FrontendError {
  code: ErrorCode | string;
  message: string;
  retryable: boolean;
  meta: {
    requestId?: string;
    originalMessage?: string;
  };
}
```

**Smart Retry Logic:**

- ✅ Auto-retry: 503, 500, network errors (transient failures)
- ❌ No retry: 404, 422, 400 (user/validation errors)
- Exponential backoff: 1s, 2s, 4s (capped at 30s)

#### 3. Loan API Service (`api/loans.ts`)

Typed service layer with methods:

```typescript
export const loansApi = {
  async getReview(loanId: string): Promise<LoanReviewResponse>
};
```

All errors are normalized to `FrontendError` before throwing.

#### 4. TanStack Query Hook (`hooks/useLoanReview.ts`)

Production hook with identical interface to Phase 1 mock:

```typescript
const { data, error, isLoading, refetch } = useLoanReview(loanId);
```

**Features:**

- Query key caching: Different loan IDs cached separately
- Stale-while-revalidate: 5-minute stale time
- Garbage collection: 10-minute cache retention
- Request ID propagation for debugging
- Disabled when `loanId` is null

### Environment Configuration

Set the API base URL in `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

**Default:** `http://localhost:3000/api`

### Error Code Mapping

| Backend Error         | HTTP Status   | User Message                                                                               | Retryable |
| --------------------- | ------------- | ------------------------------------------------------------------------------------------ | --------- |
| NOT_FOUND             | 404           | "Loan not found. Please check the loan ID and try again."                                  | ❌ No     |
| VALIDATION_FAILED     | 400           | "Invalid request. Please check your input."                                                | ❌ No     |
| LEGACY_DATA_CORRUPT   | 422           | "Loan data is unavailable or corrupted. Please contact support with the request ID below." | ❌ No     |
| AI_TIMEOUT            | 408/503       | "Request timed out. The risk service is taking too long. Please retry."                    | ✅ Yes    |
| RISK_SERVICE_DOWN     | 503           | "Risk service is currently unavailable. Please retry in a moment."                         | ✅ Yes    |
| INTERNAL_SERVER_ERROR | 500           | "Internal server error. Our team has been notified. Please retry."                         | ✅ Yes    |
| NETWORK_ERROR         | (no response) | "Network connection error. Please check your internet and retry."                          | ✅ Yes    |

### Testing with MSW

Phase 2 uses Mock Service Worker for realistic HTTP testing:

**Setup:** `api/__tests__/setup.ts` configures MSW server lifecycle  
**Handlers:** `api/__tests__/mocks/handlers.ts` intercepts API requests

**Special Loan IDs for Testing:**

- `mock-not-found` → 404 NOT_FOUND
- `mock-legacy-corrupt` → 422 LEGACY_DATA_CORRUPT
- `mock-timeout` → 503 AI_TIMEOUT
- `mock-service-down` → 503 RISK_SERVICE_DOWN
- `mock-server-error` → 500 INTERNAL_SERVER_ERROR
- Default → 200 success with mock data

### Test Coverage

Phase 2 adds comprehensive test coverage:

- ✅ **API Client Tests** (`client.spec.ts`) – Configuration and interceptors
- ✅ **Error Normalization Tests** (`errors.spec.ts`) – All error codes and retry logic
- ✅ **Service Layer Tests** (`loans.spec.ts`) – Happy path and error scenarios
- ✅ **Hook Integration Tests** (`useLoanReview.spec.ts`) – Query lifecycle and caching

**Target: 70%+ coverage for new code**

### QueryClientProvider Setup

App.tsx wraps the application with TanStack Query provider:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Each hook defines its own retry logic
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <LoanReviewScreen />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Request ID Tracking

Every API response includes `meta.requestId` for debugging:

```typescript
// Success response
{
  loan: { ... },
  risk: { ... },
  meta: { requestId: "uuid-123..." }
}

// Error response
{
  error: { code: "NOT_FOUND", message: "..." },
  meta: { requestId: "uuid-456..." }
}
```

Request IDs are:

- Extracted from responses/errors
- Displayed in error UI
- Available for copying to clipboard
- Useful for support debugging

### Backwards Compatibility

✅ **No component changes required**  
✅ **Hook interface unchanged**  
✅ **All Phase 1 tests pass**  
✅ **Type definitions reused**

Components simply switch from:

```typescript
const { data, error, isLoading, refetch } = useLoanReviewState({ loanId });
```

To:

```typescript
const { data, error, isLoading, refetch } = useLoanReview(loanId);
```

---

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vitest Docs](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- shadcn/ui (base `Button`)
- ESLint + Prettier
- Vitest + React Testing Library
