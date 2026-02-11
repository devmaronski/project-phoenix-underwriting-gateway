/**
 * Main App component for Phase 1.
 * Renders the LoanReviewScreen with a demo scenario.
 */

import { LoanReviewScreen } from "@/components/LoanReviewScreen";

export function App() {
  return <LoanReviewScreen defaultLoanId="loan-123" mockScenario="success" />;
}

export default App;
