# Project Phoenix – Frontend README

## Overview

This is the **Phase 1: UI Skeleton** implementation of the Project Phoenix Loan Review Screen. The frontend displays loan details and risk assessments with progressive disclosure for detailed risk factors.

**Phase 1 Status**: Complete (mock data)  
**Phase 2**: Real API integration with TanStack Query  
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
│   │   ├── useLoanReviewState.spec.ts
│   │   └── useDisclosure.spec.ts
│   ├── useLoanReviewState.ts       # Mock state (Phase 1) → TanStack Query (Phase 2)
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
├── App.tsx                         # Root component
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
  mockScenario?: "success" | "lowRisk" | "highRisk" | "loanNotFound" | "aiTimeout";
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

| Code | Retry? |
|------|--------|
| NOT_FOUND | ❌ No |
| VALIDATION_FAILED | ❌ No |
| LEGACY_DATA_CORRUPT | ❌ No |
| AI_TIMEOUT | ✅ Yes |
| RISK_SERVICE_DOWN | ✅ Yes |
| NETWORK_ERROR | ✅ Yes |

### Request ID for Debugging

Every error includes a UUID `requestId` that users can copy and share with support.

---

## Risk Score Colors

| Score | Level | Color |
|-------|-------|-------|
| 0–39 | Low Risk | Green |
| 40–69 | Medium Risk | Yellow |
| 70–100 | High Risk | Red |

---

## Environment Variables

Create a `.env.local` file (Phase 2):

```env
VITE_API_BASE_URL=http://localhost:3000/api
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
