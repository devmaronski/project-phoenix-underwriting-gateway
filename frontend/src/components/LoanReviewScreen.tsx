import { useLoanReview } from '@/hooks/useLoanReview';
import { ErrorBanner } from './ErrorBanner';
import { LoadingState } from './LoadingState';
import { LoanSummaryCard } from './LoanSummaryCard';
import { RiskScoreCard } from './RiskScoreCard';

interface LoanReviewScreenProps {
  loanId: string | null;
}

export function LoanReviewScreen({ loanId }: LoanReviewScreenProps) {
  const { data, error, isLoading, isError, refetch } = useLoanReview(loanId);

  if (!loanId || loanId.trim() === '') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Enter a loan ID to view details</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return (
      <ErrorBanner
        error={
          error || {
            code: 'UNKNOWN_ERROR',
            message: 'An unexpected error occurred'
          }
        }
        requestId={error?.requestId}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <LoanSummaryCard loan={data.loan} />
      <RiskScoreCard
        score={data.risk.score}
        topReasons={data.risk.topReasons}
        allReasons={data.risk.allReasons}
      />

      {data.meta?.requestId && (
        <div className="text-xs text-gray-400 text-right">
          Request ID: {data.meta.requestId}
        </div>
      )}
    </div>
  );
}
