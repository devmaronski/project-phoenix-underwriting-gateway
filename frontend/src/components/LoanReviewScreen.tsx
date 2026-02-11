/**
 * LoanReviewScreen: Main orchestrator component.
 * Manages loanId state and renders appropriate UI based on data/error/loading states.
 */

import { useState } from "react";
import { useLoanReviewState } from "@/hooks/useLoanReviewState";
import { RiskScoreCard } from "./RiskScoreCard";
import { ErrorBanner } from "./ErrorBanner";
import { LoadingState } from "./LoadingState";
import { LoanSummaryCard } from "./LoanSummaryCard";
import { Button } from "./ui/button";

export interface LoanReviewScreenProps {
  /**
   * Optional initial loan ID (for development/demo).
   * If not provided, a loan ID can be entered via input.
   */
  defaultLoanId?: string;
  /**
   * Mock scenario for Phase 1 testing (success, lowRisk, error, etc.)
   */
  mockScenario?:
    | "success"
    | "lowRisk"
    | "mediumRisk"
    | "highRisk"
    | "loanNotFound"
    | "aiTimeout";
}

export function LoanReviewScreen({
  defaultLoanId = "loan-123",
  mockScenario = "success",
}: LoanReviewScreenProps) {
  const [loanId, setLoanId] = useState<string | null>(defaultLoanId);
  const [inputValue, setInputValue] = useState(defaultLoanId || "");
  const { data, error, isLoading, refetch } = useLoanReviewState({
    loanId,
    mockScenario,
  });

  const handleRetry = () => {
    refetch();
  };

  const handleLoadLoan = () => {
    if (inputValue.trim()) {
      setLoanId(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLoadLoan();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Loan Review</h1>
          <p className="mt-2 text-slate-600">
            Review loan details and risk assessment
          </p>
        </div>

        {/* Loan ID Input (for development) */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Enter loan ID (e.g., loan-123)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <Button onClick={handleLoadLoan} className="bg-blue-600 hover:bg-blue-700">
            Load
          </Button>
        </div>

        {/* Error State */}
        {error && <ErrorBanner error={error} onRetry={handleRetry} />}

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Success State */}
        {data && !isLoading && (
          <div className="space-y-6">
            <LoanSummaryCard loan={data.loan} />
            <RiskScoreCard risk={data.risk} requestId={data.meta.requestId} />
          </div>
        )}

        {/* Empty State */}
        {!data && !isLoading && !error && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">
              Enter a loan ID above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
