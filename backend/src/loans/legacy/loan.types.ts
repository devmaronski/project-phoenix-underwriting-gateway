/**
 * LegacyLoan - Raw data structure from legacy loan system
 * Represents loan data as it comes from the legacy source, without normalization
 */
export interface LegacyLoan {
  id: string;
  borrower_name: string;
  loan_amount_cents: number;
  issued_date: string;
  interest_rate_percent: number;
  term_months: number;
}
