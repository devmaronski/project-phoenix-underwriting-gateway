import { LoanSanitizedSchema } from './loan.schema';

describe('LoanSanitizedSchema', () => {
  it('should parse a valid sanitized loan', () => {
    const sanitized = {
      id: 'LOAN-100',
      borrower_name: 'Ada Lovelace',
      loan_amount_dollars: 1500.5,
      issued_date: '2024-02-20T00:00:00.000Z',
      interest_rate_percent: 6.25,
      term_months: 60,
    };

    const result = LoanSanitizedSchema.safeParse(sanitized);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(sanitized);
    }
  });

  it('should reject negative loan_amount_dollars', () => {
    const sanitized = {
      id: 'LOAN-101',
      borrower_name: 'Grace Hopper',
      loan_amount_dollars: -10,
      issued_date: '2024-02-20T00:00:00.000Z',
      interest_rate_percent: 5.0,
      term_months: 36,
    };

    const result = LoanSanitizedSchema.safeParse(sanitized);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe('loan_amount_dollars');
    }
  });

  it('should reject non-ISO issued_date', () => {
    const sanitized = {
      id: 'LOAN-102',
      borrower_name: 'Alan Turing',
      loan_amount_dollars: 2500,
      issued_date: '2024-02-20',
      interest_rate_percent: 4.75,
      term_months: 48,
    };

    const result = LoanSanitizedSchema.safeParse(sanitized);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe('issued_date');
    }
  });
});
