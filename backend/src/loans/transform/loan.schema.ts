/**
 * LoanSanitized - Normalized and validated loan data
 * Represents loan data after transformation from legacy format
 * - cents converted to decimal dollars
 * - dates normalized to UTC ISO8601 format
 * - all required fields present and valid
 */
export interface LoanSanitized {
  id: string;
  borrower_name: string;
  loan_amount_dollars: number; // decimal, not cents
  issued_date: string; // ISO8601 format, UTC
  interest_rate_percent: number;
  term_months: number;
}

/**
 * Validation rules for transformation:
 * 1. loan_amount_cents must be non-negative integer
 * 2. issued_date must be valid ISO8601 date (YYYY-MM-DD)
 * 3. All required fields must be present
 * 4. Dates are normalized to UTC ISO8601 format
 */
