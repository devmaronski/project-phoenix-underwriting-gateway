/**
 * Main App component with TanStack Query provider for Phase 2.
 * Renders the LoanReviewScreen with query client context.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LoanReviewScreen } from "@/components/LoanReviewScreen";
import './index.css';

// Create Query Client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable global retry; each hook defines its own
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnMount: true, // Refetch on component mount if stale
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 p-4">
        <LoanReviewScreen defaultLoanId="loan-123" mockScenario="success" />
      </div>
      {/* React Query DevTools for debugging (visible in dev mode only) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
