import { z } from 'zod';

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
 * ISO8601 date regex pattern (YYYY-MM-DD)
 */
const ISO8601_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates that a date string is in ISO8601 YYYY-MM-DD format
 */
const isValidISO8601Date = (dateStr: string): boolean => {
  if (!ISO8601_DATE_REGEX.test(dateStr)) {
    return false;
  }

  const date = new Date(dateStr + 'T00:00:00Z');
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Validation rules for transformation:
 * 1. loan_amount_cents must be non-negative integer
 * 2. issued_date must be valid ISO8601 date (YYYY-MM-DD)
 * 3. All required fields must be present
 * 4. Dates are normalized to UTC ISO8601 format
 */
export const LegacyLoanSchema = z.object({
  id: z.string({ required_error: 'missing required field' }),
  borrower_name: z.string({ required_error: 'missing required field' }),
  loan_amount_cents: z
    .number({
      required_error: 'missing required field',
      invalid_type_error: 'must be a number',
    })
    .refine((value: number) => Number.isInteger(value), {
      message: 'must be an integer',
    })
    .refine((value: number) => value >= 0, {
      message: 'must be non-negative',
    }),
  issued_date: z
    .string({
      required_error: 'missing required field',
      invalid_type_error: 'must be in ISO8601 format (YYYY-MM-DD)',
    })
    .refine((value: string) => isValidISO8601Date(value), {
      message: 'must be in ISO8601 format (YYYY-MM-DD)',
    }),
  interest_rate_percent: z.number({ required_error: 'missing required field' }),
  term_months: z.number({ required_error: 'missing required field' }),
});
