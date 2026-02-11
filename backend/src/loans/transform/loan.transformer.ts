import { LegacyLoan } from '../legacy/loan.types';
import { LoanSanitized } from './loan.schema';
import { AppError } from '../../common/errors/app-error';

/**
 * ISO8601 date regex pattern (YYYY-MM-DD)
 */
const ISO8601_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates that a date string is in ISO8601 YYYY-MM-DD format
 */
function isValidISO8601Date(dateStr: unknown): boolean {
  if (typeof dateStr !== 'string') {
    return false;
  }

  if (!ISO8601_DATE_REGEX.test(dateStr)) {
    return false;
  }

  // Additional validation: ensure it's a valid date
  const date = new Date(dateStr + 'T00:00:00Z');
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validates that cents value is a non-negative integer
 */
function isValidCents(cents: unknown): boolean {
  return typeof cents === 'number' && Number.isInteger(cents) && cents >= 0;
}

/**
 * Transform raw legacy loan data into normalized, validated loan data
 * @param raw - Raw loan data from legacy system
 * @returns Sanitized and validated loan
 * @throws AppError with LEGACY_DATA_CORRUPT if validation fails
 */
export function transformLoan(raw: LegacyLoan): LoanSanitized {
  // Validate loan_amount_cents
  if (raw.loan_amount_cents === undefined || raw.loan_amount_cents === null) {
    throw new AppError(
      'LEGACY_DATA_CORRUPT',
      'Missing required field: loan_amount_cents',
      {
        field: 'loan_amount_cents',
        reason: 'missing required field',
      },
    );
  }

  if (!isValidCents(raw.loan_amount_cents)) {
    const reason =
      typeof raw.loan_amount_cents !== 'number'
        ? 'must be a number'
        : Number.isInteger(raw.loan_amount_cents)
          ? 'must be non-negative'
          : 'must be an integer';

    throw new AppError(
      'LEGACY_DATA_CORRUPT',
      `Invalid cents value: ${reason}`,
      {
        field: 'loan_amount_cents',
        reason,
        received: raw.loan_amount_cents,
      },
    );
  }

  // Validate issued_date
  if (raw.issued_date === undefined || raw.issued_date === null) {
    throw new AppError(
      'LEGACY_DATA_CORRUPT',
      'Missing required field: issued_date',
      {
        field: 'issued_date',
        reason: 'missing required field',
      },
    );
  }

  if (!isValidISO8601Date(raw.issued_date)) {
    throw new AppError(
      'LEGACY_DATA_CORRUPT',
      `Invalid date format for issued_date: must be YYYY-MM-DD`,
      {
        field: 'issued_date',
        reason: 'must be in ISO8601 format (YYYY-MM-DD)',
        received: raw.issued_date,
      },
    );
  }

  // Convert cents to dollars
  const loanAmountDollars = raw.loan_amount_cents / 100;

  // Normalize date to UTC ISO8601
  const issuedDate = new Date(raw.issued_date + 'T00:00:00Z').toISOString();

  return {
    id: raw.id,
    borrower_name: raw.borrower_name,
    loan_amount_dollars: loanAmountDollars,
    issued_date: issuedDate,
    interest_rate_percent: raw.interest_rate_percent,
    term_months: raw.term_months,
  };
}
