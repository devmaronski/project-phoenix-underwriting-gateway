/**
 * LoanSummaryCard: Displays loan information.
 */

import { Loan } from '@/types/api.types';
import { formatCurrency, formatDate, formatPercent } from '@/utils/format';
import { Card } from './ui/card';

export interface LoanSummaryCardProps {
  loan: Loan;
}

export function LoanSummaryCard({ loan }: LoanSummaryCardProps) {
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-900">Loan Details</h2>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* Borrower Name */}
          <div>
            <p className="text-sm text-slate-600">Borrower Name</p>
            <p className="mt-1 font-medium text-slate-900">
              {loan.borrower_name}
            </p>
          </div>

          {/* Loan Amount */}
          <div>
            <p className="text-sm text-slate-600">Loan Amount</p>
            <p className="mt-1 font-medium text-slate-900">
              {formatCurrency(loan.loan_amount_dollars)}
            </p>
          </div>

          {/* Interest Rate */}
          <div>
            <p className="text-sm text-slate-600">Interest Rate</p>
            <p className="mt-1 font-medium text-slate-900">
              {formatPercent(loan.interest_rate_percent)}
            </p>
          </div>

          {/* Term */}
          <div>
            <p className="text-sm text-slate-600">Term</p>
            <p className="mt-1 font-medium text-slate-900">
              {loan.term_months} months
            </p>
          </div>

          {/* Issued Date */}
          <div className="col-span-2">
            <p className="text-sm text-slate-600">Issued Date</p>
            <p className="mt-1 font-medium text-slate-900">
              {formatDate(loan.issued_date)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
