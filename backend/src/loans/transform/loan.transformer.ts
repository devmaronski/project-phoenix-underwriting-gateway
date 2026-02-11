import { LegacyLoan } from '../legacy/loan.types';
import { LegacyLoanSchema, LoanSanitized } from './loan.schema';
import { AppError } from '../../common/errors/app-error';
import { ZodError } from 'zod';

const mapZodErrorToAppError = (
  raw: LegacyLoan,
  error: ZodError,
): AppError => {
  const issue = error.issues[0];
  const field = issue?.path?.[0];

  if (field === 'loan_amount_cents') {
    if (issue.message === 'missing required field') {
      return new AppError(
        'LEGACY_DATA_CORRUPT',
        'Missing required field: loan_amount_cents',
        {
          field: 'loan_amount_cents',
          reason: 'missing required field',
        },
      );
    }

    const reason = issue.message;
    return new AppError(
      'LEGACY_DATA_CORRUPT',
      `Invalid cents value: ${reason}`,
      {
        field: 'loan_amount_cents',
        reason,
        received: raw.loan_amount_cents,
      },
    );
  }

  if (field === 'issued_date') {
    if (issue.message === 'missing required field') {
      return new AppError(
        'LEGACY_DATA_CORRUPT',
        'Missing required field: issued_date',
        {
          field: 'issued_date',
          reason: 'missing required field',
        },
      );
    }

    return new AppError(
      'LEGACY_DATA_CORRUPT',
      'Invalid date format for issued_date: must be YYYY-MM-DD',
      {
        field: 'issued_date',
        reason: 'must be in ISO8601 format (YYYY-MM-DD)',
        received: raw.issued_date,
      },
    );
  }

  return new AppError('LEGACY_DATA_CORRUPT', issue.message, {
    field: typeof field === 'string' ? field : 'unknown',
    reason: issue.message,
  });
};

/**
 * Transform raw legacy loan data into normalized, validated loan data
 * @param raw - Raw loan data from legacy system
 * @returns Sanitized and validated loan
 * @throws AppError with LEGACY_DATA_CORRUPT if validation fails
 */
export function transformLoan(raw: LegacyLoan): LoanSanitized {
  const parsed = LegacyLoanSchema.safeParse(raw);
  if (!parsed.success) {
    throw mapZodErrorToAppError(raw, parsed.error);
  }

  // Convert cents to dollars
  const loanAmountDollars = parsed.data.loan_amount_cents / 100;

  // Normalize date to UTC ISO8601
  const issuedDate = new Date(
    parsed.data.issued_date + 'T00:00:00Z',
  ).toISOString();

  return {
    id: parsed.data.id,
    borrower_name: parsed.data.borrower_name,
    loan_amount_dollars: loanAmountDollars,
    issued_date: issuedDate,
    interest_rate_percent: parsed.data.interest_rate_percent,
    term_months: parsed.data.term_months,
  };
}
